import React, { useState, useEffect, useCallback } from "react";
import {
  Business as ServicesIcon,
  ArrowDropDown,
  ArrowDropUp,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { Collapse } from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import EngineeringOutlinedIcon from "@mui/icons-material/EngineeringOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import MenuIcon from "@mui/icons-material/Menu"; // Hamburger menu icon
import CloseIcon from "@mui/icons-material/Close"; // Close menu icon
import { Link, useLocation } from "react-router-dom"; // For routing
import "./sidenavbar.css";

const Sidenavbar = () => {
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [activeReport, setActiveReport] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.split("/").pop(); // Extract route name
    setActiveItem(path);
    setActiveReport(null); // Reset active report when location changes
  }, [location]);

  const handleClick = useCallback((item, isReport = false, e) => {
    e.preventDefault();  // Prevent default link behavior on div click
    if (isReport) {
      setActiveReport(item);
    } else if (item === "reports") {
      setIsReportsOpen((prev) => !prev); // Toggle reports
    }
    setActiveItem(item);
  }, []);

  const renderNavItem = (icon, label, itemKey, route) => {
    const isActive = activeItem === itemKey || location.pathname === route;
    return (
      <div
        onClick={(e) => handleClick(itemKey, false, e)} // Pass event to handleClick
        className={`flex items-center cursor-pointer p-2 m-4 text-[12px] ${
          isActive ? "bg-white text-[#660F5D] rounded-lg" : "text-white"
        }`}
        role="menuitem" // Accessibility
        aria-label={label} // Accessibility
      >
        <Link to={route} className="flex items-center w-full">
          {React.cloneElement(icon, {
            style: {
              fill: isActive ? "#660F5D" : "white",
              width: "20px",
              height: "20px",
            },
            className: "w-5 h-5",
          })}
          <span className="ml-4">{label}</span>
        </Link>
      </div>
    );
  };

  return (
    <div className="flex">
      <div
        className={`fixed sm:static top-0 left-0 w-[250px] bg-[#660F5D] text-white transform ${
          isSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full overflow-y-auto scrollbar-hidden mt-4"
        } sm:translate-x-0 transition-transform duration-300 z-50 h-full sm:h-auto`}
      >
        {/* Logo Section */}
        <div className="h-[60px] w-[250px] bg-white flex items-center justify-center relative">
          <img
            src="/assets/images/Frame 427319709.png"
            alt="logo"
            className="h-full w-full object-contain"
          />
          {/* Mobile Close Button */}
          {isSidebarOpen && (
            <button
              className="absolute top-4 right-4 sm:hidden z-60 p-2 rounded-full bg-white"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close menu"
            >
              <CloseIcon className="text-[#660F5D]" />
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto mt-4 scrollbar-hidden">
          <div className="space-y-4 font-medium">
            {renderNavItem(
              <PeopleAltOutlinedIcon />,
              "Organization",
              "organization",
              "/organizationlist"
            )}
            {renderNavItem(
              <EngineeringOutlinedIcon />,
              "Organization Type",
              "organizationType",
              "/organizationtypelist"
            )}
            {renderNavItem(
              <EngineeringOutlinedIcon />,
              "Roles",
              "roles",
              "/roles-list"
            )}
            {renderNavItem(
              <ServicesIcon />,
              "Services",
              "services",
              "/services"
            )}

            {/* Reports Section */}
            <div
              onClick={(e) => handleClick("reports", false, e)}
              className={`flex items-center cursor-pointer p-2 m-4 text-[12px] ${
                activeItem === "reports"
                  ? "bg-white text-[#660F5D] rounded-lg"
                  : "text-white"
              }`}
              role="menuitem" // Accessibility
              aria-expanded={isReportsOpen} // Accessibility
              aria-label="Reports"
            >
              <AssessmentOutlinedIcon className="w-5 h-5" />
              <span className="ml-4">Reports</span>
              {isReportsOpen ? (
                <ArrowDropUp className="ml-auto" />
              ) : (
                <ArrowDropDown className="ml-auto" />
              )}
            </div>

            {/* Submenu */}
            <Collapse style={{ margin: "0px" }} in={isReportsOpen}>
              <div className="pl-6 space-y-4">
                {[
                  { label: "User Reports", route: "/userreports" },
                  { label: "Order Reports", route: "/orderreports" },
                  { label: "Payment Reports", route: "/paymentreports" },
                  { label: "Revenue Reports", route: "/revenuereports" },
                ].map((report) => {
                  return (
                    <div
                      key={report.label}
                      onClick={(e) => handleClick(report.label, true, e)}
                      className={`flex items-center cursor-pointer p-2 m-4 text-[12px] ${
                        activeReport === report.label ||
                        location.pathname.includes(report.route)
                          ? "bg-white text-[#660F5D] rounded-lg"
                          : "text-white"
                      }`}
                      role="menuitem"
                      aria-label={report.label}
                    >
                      <Link to={report.route} className="flex items-center w-full">
                        <ArrowRightIcon className="w-5 h-5 mr-2" />
                        {report.label}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </Collapse>

            {/* Settings Section */}
            <div
              onClick={(e) => handleClick("settings", false, e)}
              className={`flex items-center cursor-pointer p-2 m-4 mt-0 text-[12px] ${
                activeItem === "settings"
                  ? "bg-white text-[#660F5D] rounded-lg"
                  : "text-white"
              }`}
              role="menuitem" // Accessibility
              aria-label="Settings" // Accessibility
            >
              <Link to="/settings" className="flex items-center w-full">
                <SettingsIcon className="w-5 h-5" />
                <span className="ml-4 mt-0">Settings</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        className="sm:hidden fixed top-4 left-4 z-60 p-2 rounded-full"
        onClick={() => setIsSidebarOpen((prev) => !prev)}
        aria-label="Toggle menu"
      >
        {isSidebarOpen ? (
          <CloseIcon className="text-white" />
        ) : (
          <MenuIcon className="text-[#660F5D]" />
        )}
      </button>

      {/* Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close menu"
        ></div>
      )}
    </div>
  );
};

export default Sidenavbar;
