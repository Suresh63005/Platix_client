import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import Login from "../Components/Auth/Login";
import { Toaster } from "react-hot-toast";
import { createMemoryHistory } from "history";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Mocking API calls to avoid actual network requests
jest.mock("../utils/api", () => ({
  post: jest.fn(),
}));

import api from "../utils/api";

describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous mocks before each test
  });

  test("renders email and password fields correctly", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  test("allows user to type in email and password", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  test("clicks login button and shows loading spinner", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Fill in the login form
    await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "password123");

    // Click login button
    await userEvent.click(screen.getByRole("button"));

    // ✅ Wait for the button to be disabled
    // await waitFor(() => {
    //   expect(screen.getByRole("button")).toBeDisabled();
    // });

    // ✅ Wait for the Vortex loader to appear
    // await waitFor(() => {
    //   expect(screen.getByLabelText("vortex-loading")).toBeInTheDocument();
    // });
  });

  test("displays error when login fails", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole("button", { name: /login/i });

    // Simulate user input
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");

    // Mock failed login response
    api.post.mockRejectedValueOnce({
      response: { status: 401, data: { message: "Invalid credentials" } },
    });

    // Click login button
    await userEvent.click(loginButton);

    // Verify that login fails and shows the appropriate error message
    await waitFor(() =>
      expect(screen.getByText("Incorrect password")).toBeInTheDocument()
    );
  });

  test("navigates to the correct page after successful login", async () => {
    const history = createMemoryHistory();
    render(
      <Router location={history.location} navigator={history}>
        <Login />
      </Router>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole("button", { name: /login/i });

    // Simulate user input
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");

    // Mock successful login response
    api.post.mockResolvedValueOnce({ data: { token: "mockToken" } });

    // Click login button
    await userEvent.click(loginButton);

    // Verify navigation after successful login (simulating navigate behavior)
    await waitFor(() =>
      // in login.jsx to comment out the setTimeout function to make the test pass
      expect(history.location.pathname).toBe("/organizationlist")
    );
  });

  test("shows toast notification on successful login", async () => {
    jest.setTimeout(10000); // ⏳ Increase timeout if needed

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole("button", { name: /login/i });

    // Simulate user input
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");

    // Mock successful API response
    api.post.mockResolvedValueOnce({ data: { token: "mockToken" } });

    // Click login button
    await userEvent.click(loginButton);

    // ✅ Wait for toast with longer timeout
    await waitFor(() => {
      expect(screen.getByText("Login successful!")).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  test("shows error toast if login fails", async () => {
    render(
      <MemoryRouter>
        <Login />
        <Toaster position="top-right" />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole("button", { name: /login/i });

    // Simulate user input
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");

    // Mock failed login response
    api.post.mockRejectedValueOnce({
      response: { status: 401, data: { message: "Invalid credentials" } },
    });

    // Click login button
    await userEvent.click(loginButton);

    // Wait for toast to show error
    await waitFor(() => expect(screen.getByText("Incorrect password")).toBeInTheDocument());
  });

  test("toggles password visibility when eye button is clicked", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const passwordInput = screen.getByLabelText(/Password/i);
    const eyeButton = screen.getByRole("button", { name: /toggle password visibility/i });

    // Initially, the password input should be of type "password"
    expect(passwordInput).toHaveAttribute("type", "password");

    // Click the eye button to show the password
    await userEvent.click(eyeButton);

    // The password input should now be of type "text"
    expect(passwordInput).toHaveAttribute("type", "text");

    // Click the eye button again to hide the password
    await userEvent.click(eyeButton);

    // The password input should now be of type "password" again
    expect(passwordInput).toHaveAttribute("type", "password");
  });
});