import React, { useState, createContext, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/Auth/Login";
import Forgotpass from "./Components/Auth/Forgotpass";
import Createnewpass from "./Components/Auth/Createnewpass";
import Sidenavbar from "./Components/Navbar/Sidenavbar";
import Userspage from "./Components/Users/Userspage";
import Createuser from "./Components/Users/Createuserpage";
import "./App.css";
import Rolespage from "./Components/Roles/RolesList";
import CreateOrganization from "./Components/Organization/CreateOrganization";
import Organizationlist from "./Components/Organization/Organizationlist";
import OrganizationTypelist from "./Components/Organization Type/OrganizationTypelist";
import CreateOrganizationType from "./Components/Organization Type/CreateOrganizationType";
import Services from "./Components/Services/Services";
import CreateService from "./Components/Services/CreateService";
import UserReports from "./Components/Reports/UserReports";
import OrderReports from "./Components/Reports/OrderReports";
import PaymentsReports from "./Components/Reports/PaymentsReports";
import RevenueReports from "./Components/Reports/RevenueReports";
import Settings from "./Components/SettingsPage/Settings";
import Account from "./Components/Account/Account";
// Custom hook to use Auth Context
// const useAuth = () => useContext(AuthContext);

// Sidebar Layout Component
function LayoutSidebar({ children }) {
  return (
    <div className="h-screen flex">
      <Sidenavbar />
      <div className="flex-1">{children}</div>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/forgotpass" element={<Forgotpass />} />
          <Route path="/createnewpass" element={<Createnewpass />} />

          {/* Protected Route with Sidebar Layout */}
          <Route
            path="/userpage"
            element={
              <LayoutSidebar>
                <Userspage />
              </LayoutSidebar>
            }
          />
          <Route
            path="/createuser"
            element={
              <LayoutSidebar>
                <Createuser />
              </LayoutSidebar>
            }
          />
          <Route
            path="/roles-list"
            element={
              <LayoutSidebar>
                <Rolespage />
              </LayoutSidebar>
            }
          />
          <Route
            path="/createorganization"
            element={
              <LayoutSidebar>
                <CreateOrganization />
              </LayoutSidebar>
            }
          />
          <Route
            path="/createorganization/:id"
            element={
              <LayoutSidebar>
                <CreateOrganization />
              </LayoutSidebar>
            }
          />
          <Route
            path="/organizationlist"
            element={
              <LayoutSidebar>
                <Organizationlist />
              </LayoutSidebar>
            }
          />
          <Route
            path="/organizationtypelist"
            element={
              <LayoutSidebar>
                <OrganizationTypelist />
              </LayoutSidebar>
            }
          />
          <Route
            path="/createorganizationtype"
            element={
              <LayoutSidebar>
                <CreateOrganizationType />
              </LayoutSidebar>
            }
          />
          <Route
            path="/services"
            element={
              <LayoutSidebar>
                <Services />
              </LayoutSidebar>
            }
          />
          <Route
            path="/createservice"
            element={
              <LayoutSidebar>
                <CreateService />
              </LayoutSidebar>
            }
          />
          <Route
            path="/userreports"
            element={
              <LayoutSidebar>
                <UserReports />
              </LayoutSidebar>
            }
          />
          <Route
            path="/orderreports"
            element={
              <LayoutSidebar>
                <OrderReports />
              </LayoutSidebar>
            }
          />
          <Route
            path="/paymentreports"
            element={
              <LayoutSidebar>
                <PaymentsReports />
              </LayoutSidebar>
            }
          />
          <Route
            path="/revenuereports"
            element={
              <LayoutSidebar>
                <RevenueReports />
              </LayoutSidebar>
            }
          />
          <Route
            path="/settings"
            element={
              <LayoutSidebar>
                <Settings />
              </LayoutSidebar>
            }
          />
          <Route
            path="/account"
            element={
              <LayoutSidebar>
                <Account />
              </LayoutSidebar>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
