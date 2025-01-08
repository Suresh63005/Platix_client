import React, { useState, useEffect } from "react";
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
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useLocation } from "react-router-dom";
import "./sidenavbar.css";

const Sidenavbar = () => {
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [activeReport, setActiveReport] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.split("/").pop(); // Extract route name
    setActiveItem(path.includes("report") ? "reports" : path);
    setActiveReport(path.includes("report") ? path : null);
  }, [location]);

  const handleClick = (item, isReport = false) => {
    if (isReport) {
      setActiveReport(item);
    } else {
      if (item === "reports") {
        setIsReportsOpen(!isReportsOpen);
      } else {
        setIsReportsOpen(false); // Close reports dropdown when navigating elsewhere
      }
      setActiveItem(item);
    }
  };

  const renderNavItem = (icon, label, itemKey, route) => {
    const isActive = activeItem === itemKey || location.pathname === route;
    return (
      <li
        onClick={() => handleClick(itemKey)}
        className={`flex items-center cursor-pointer p-2 m-4 text-[12px] ${
          isActive ? "bg-white text-[#660F5D] rounded-lg" : "text-white"
        }`}
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
      </li>
    );
  };

  return (
    <div className="flex">
      <div
        className={`fixed sm:static top-0 left-0 w-[250px] bg-[#660F5D] text-white transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0 transition-transform duration-300 z-50 h-full sm:h-auto`}
      >
        <div className="h-[60px] w-[250px] bg-white flex items-center justify-center relative">
          <img
            src="/assets/images/Frame 427319709.png"
            alt="logo"
            className="h-full w-full object-contain"
          />
          {isSidebarOpen && (
            <button
              className="absolute top-4 right-4 sm:hidden z-60 p-2 rounded-full bg-white"
              onClick={() => setIsSidebarOpen(false)}
            >
              <CloseIcon className="text-[#660F5D]" />
            </button>
          )}
        </div>
        <div className="flex-1  mt-4 ">
          <ul className="space-y-4 font-medium">
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
            <li
              onClick={() => handleClick("reports")}
              className={`flex items-center cursor-pointer p-2 m-4 text-[12px] ${
                activeItem === "reports"
                  ? "bg-white text-[#660F5D] rounded-lg"
                  : "text-white"
              }`}
            >
              <AssessmentOutlinedIcon className="w-5 h-5" />
              <span className="ml-4">Reports</span>
              {isReportsOpen ? (
                <ArrowDropUp className="ml-auto" />
              ) : (
                <ArrowDropDown className="ml-auto" />
              )}
            </li>
            <Collapse in={isReportsOpen} className="m-0">
              <ul className="pl-6 space-y-4">
                {[
                  { label: "User Reports", route: "/userreports" },
                  { label: "Order Reports", route: "/orderreports" },
                  { label: "Payment Reports", route: "/paymentreports" },
                  { label: "Revenue Reports", route: "/revenuereports" },
                ].map(({ label, route }) => (
                  <li
                    key={label}
                    onClick={() => handleClick(route, true)}
                    className={`flex items-center cursor-pointer p-2 m-4 text-[12px] ${
                      activeReport === route
                        ? "bg-white text-[#660F5D] rounded-lg"
                        : "text-white"
                    }`}
                  >
                    <Link to={route} className="flex items-center w-full">
                      <ArrowRightIcon className="w-5 h-5 mr-2" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Collapse>
            <li
              onClick={() => handleClick("settings")}
              className={`flex items-center cursor-pointer p-2 m-4 text-[12px] ${
                activeItem === "settings"
                  ? "bg-white text-[#660F5D] rounded-lg"
                  : "text-white"
              }`}
            >
              <SettingsIcon className="w-5 h-5" />
              <span className="ml-4">Settings</span>
            </li>
          </ul>
        </div>
      </div>
      <button
        className="sm:hidden fixed top-4 left-4 z-60 p-2 rounded-full"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <CloseIcon className="text-white" />
        ) : (
          <MenuIcon className="text-[#660F5D]" />
        )}
      </button>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Sidenavbar;
