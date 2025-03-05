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
import ProtectedRoute from "./ProtectedRoute";
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
          <Route path="/createnewpass/:token" element={<Createnewpass />} />

          {/* Protected Route with Sidebar Layout */}
          <Route
            path="/userspage/:organization_id"
            element={<ProtectedRoute >
              <LayoutSidebar>
                <Userspage />
              </LayoutSidebar>
              </ProtectedRoute>
            }
          />
          <Route
            path="/createuser/:organization_id"
            element={<ProtectedRoute >
              <LayoutSidebar>
                <Createuser />
              </LayoutSidebar>
              </ProtectedRoute>
            }
          />
          <Route
            path="/roles-list"
            element={<ProtectedRoute >
              <LayoutSidebar>
                <Rolespage />
              </LayoutSidebar>
              </ProtectedRoute>
            }
          />
          <Route
            path="/createorganization"
            element={<ProtectedRoute >
              <LayoutSidebar>
                <CreateOrganization />
              </LayoutSidebar>
              </ProtectedRoute>
            }
          />
          <Route
            path="/createorganization/:id"
            element={<ProtectedRoute >
              <LayoutSidebar>
                <CreateOrganization />
              </LayoutSidebar>
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizationlist"
            element={<ProtectedRoute >
              <LayoutSidebar>
                <Organizationlist />
              </LayoutSidebar>
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizationtypelist"
            element={<ProtectedRoute >
              <LayoutSidebar>
                <OrganizationTypelist />
              </LayoutSidebar>
              </ProtectedRoute>
            }
          />
          <Route
            path="/createorganizationtype"
            element={<ProtectedRoute >
              <LayoutSidebar>
                <CreateOrganizationType />
              </LayoutSidebar>
              </ProtectedRoute>
            }
          />
          <Route
            path="/services"
            element={<ProtectedRoute >
              <LayoutSidebar>
                <Services />
              </LayoutSidebar>
              </ProtectedRoute>
            }
          />
          <Route
            path="/createservice"
            element={<ProtectedRoute >
              <LayoutSidebar>
                <CreateService />
              </LayoutSidebar>
              </ProtectedRoute>
            }
          />
          <Route
            path="/userreports"
            element={<ProtectedRoute >
              <LayoutSidebar>
                <UserReports />
              </LayoutSidebar>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orderreports"
            element={<ProtectedRoute >
              <LayoutSidebar>
                <OrderReports />
              </LayoutSidebar>
              </ProtectedRoute>
            }
          />
          <Route
            path="/paymentreports"
            element={<ProtectedRoute >
              <LayoutSidebar>
                <PaymentsReports />
              </LayoutSidebar>
              </ProtectedRoute>
            }
          />
          <Route
            path="/revenuereports"
            element={<ProtectedRoute >
              <LayoutSidebar>
                <RevenueReports />
              </LayoutSidebar>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={<ProtectedRoute >
              <LayoutSidebar>
                <Settings />
              </LayoutSidebar>
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={<ProtectedRoute >
              <LayoutSidebar>
                <Account />
              </LayoutSidebar>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
