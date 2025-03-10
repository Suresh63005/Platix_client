import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import Createnewpass from "../../../Components/Auth/Createnewpass";
describe("Createnewpass Component", () => {
  test("renders password fields correctly", () => {
    render(
      <MemoryRouter>
        <Createnewpass />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/Create password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Re-enter password/i)).toBeInTheDocument();
  });

  test("allows user to type in passwords", async () => {
    render(
      <MemoryRouter>
        <Createnewpass />
      </MemoryRouter>
    );

    const newPasswordInput = screen.getByPlaceholderText(/Create password/i);
    const confirmPasswordInput = screen.getByPlaceholderText(/Re-enter password/i);

    await userEvent.type(newPasswordInput, "password123");
    await userEvent.type(confirmPasswordInput, "password123");

    expect(newPasswordInput).toHaveValue("password123");
    expect(confirmPasswordInput).toHaveValue("password123");

    // expect(newPasswordInput).toHaveValue("password12"); // ❌ This will fail
    // expect(confirmPasswordInput).toHaveValue(""); // ❌ This will fail
  });

  test("clicks submit button", async () => {
    render(
      <MemoryRouter>
        <Createnewpass />
      </MemoryRouter>
    );

    const submitButton = screen.getByRole("button", { name: /submit/i });
    await userEvent.click(submitButton);
    expect(submitButton).toBeEnabled();
  });
});
