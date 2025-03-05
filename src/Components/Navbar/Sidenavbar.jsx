import React, { useState, useEffect, useCallback } from "react";
import {
  Business as ServicesIcon,
  ArrowDropDown,
  ArrowDropUp,
  Settings as DefaultSettingsIcon,
} from "@mui/icons-material";
import { Collapse } from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import EngineeringOutlinedIcon from "@mui/icons-material/EngineeringOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./sidenavbar.css";
import { ReactComponent as LogoutIcon } from '../../assets/images/ri_logout-circle-line.svg';
import OrganizationIcon from "../../assets/images/OrganizationIcon.svg";
import ActiveorganizationIcon from "../../assets/images/active_organizationIcon.svg";
import OrganizationTypeIcon from "../../assets/images/OrganizationType.svg";
import ActiveOrganizationTypeIcon from "../../assets/images/active_organizationTypeIcon.svg";
import RolesICon from "../../assets/images/OrganizationType.svg";
import ActiveRolesIcon from "../../assets/images/active_organizationTypeIcon.svg";
import ServiceIcon from "../../assets/images/SerivceIcon.svg";
import ActiveServiceIcon from "../../assets/images/active_serviceIcon.svg";
import ReportsIcon from "../../assets/images/ReportsIcon.svg";
import ActiveReportsIcon from "../../assets/images/active_ReportsIcon.svg";
import SettingsIcon from "../../assets/images/SettingsIcon.svg";
import ActiveSettingsIcon from "../../assets/images/active_SettingsIcon.svg";
import RightDropDown from "../../assets/images/right_drop_down_arrow.svg";

const Sidenavbar = () => {
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [activeReport, setActiveReport] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const currentPath = location.pathname;

    // Set active item based on route groups
    if (
      ["/userpage", "/createuser", "/organizationlist", "/createorganization", "/organization"].includes(currentPath)
    ) {
      setActiveItem("organization");
    } else if (
      ["/organizationtypelist", "/createorganizationtype", "/organizationtype"].includes(currentPath)
    ) {
      setActiveItem("organizationType");
    } else if (
      ["/userreports", "/orderreports", "/paymentreports", "/revenuereports"].includes(currentPath)
    ) {
      setActiveItem("reports");
    } else if (currentPath.includes("/reports")) {
      setActiveItem("reports");
    } else if (currentPath === "/services") {
      setActiveItem("services");
    } else if (currentPath === "/createservice") {
      setActiveItem("services");
    } else if (currentPath === "/roles-list") {
      setActiveItem("roles");
    } else if (currentPath === "/settings") {
      setActiveItem("settings");
    } else {
      setActiveItem(null);
    }

    setActiveReport(null); // Reset active report when location changes
  }, [location]);
  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/");
  };
  const handleClick = useCallback(
    (item, route, isReport = false, e) => {
      e.preventDefault(); // Prevent default link behavior
      if (isReport) {
        setActiveReport(item);
        setActiveItem("reports"); // Ensure main "Reports" is active when selecting a report
        navigate(route);
      } else if (item === "reports") {
        setIsReportsOpen((prev) => !prev);
        // When the main "Reports" item is clicked, it will always stay active.
        setActiveItem("reports");
      } else {
        navigate(route);
        setActiveItem(item);
      }
    },
    [navigate]
  );
  const homePage=()=>{
    navigate("/organizationlist")
  }

  const renderNavItem = (defaultIcon, activeIcon, label, itemKey, route) => {
    const isActive = activeItem === itemKey;
    const icon = isActive ? activeIcon : defaultIcon;

    return (
      <div
        onClick={(e) => handleClick(itemKey, route, false, e)}
        className={`flex items-center cursor-pointer p-2 m-4 text-[12px] ${isActive ? "bg-white text-[#660F5D] rounded-lg" : "text-white"
          }`}
        role="menuitem"
        aria-label={label}
      >
        <img src={icon} alt={`${label} Icon`} className="w-5 h-5" />
        <span className="ml-4">{label}</span>
      </div>
    );
  };

  return (
    <div className="flex">
      <div
        className={`fixed sm:static top-0 left-0 md:w-[20vw] sm:w-[250px]  bg-[#660F5D] text-white transform ${isSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full overflow-y-auto scrollbar-hidden"
          } sm:translate-x-0 transition-transform duration-300 z-50 h-full sm:h-auto`}
      >
        {/* Logo Section */}
        <div className="h-[60px] w-full bg-white flex items-center justify-center sticky top-0 z-50">
          <img
            src="/assets/images/Frame 427319709.png"
            alt="logo"
            className="h-full w-full object-contain cursor-pointer"
            onClick={homePage}
          />
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
          <div className="space-y-4 font-medium md:">
            {renderNavItem(
              OrganizationIcon,
              ActiveorganizationIcon,
              "Organization",
              "organization",
              "/organizationlist"
            )}
            {renderNavItem(
              OrganizationTypeIcon,
              ActiveOrganizationTypeIcon,
              "Organization Type",
              "organizationType",
              "/organizationtypelist"
            )}
            {renderNavItem(
              RolesICon,
              ActiveRolesIcon,
              "Roles",
              "roles",
              "/roles-list"
            )}
            {renderNavItem(
              ServiceIcon,
              ActiveServiceIcon,
              "Services",
              "services",
              "/services"
            )}

            {/* Reports Section */}
            <div
              onClick={(e) => handleClick("reports", "", false, e)}
              className={`flex items-center cursor-pointer p-2 m-4 text-[12px] ${activeItem === "reports"
                  ? "bg-white text-[#660F5D] rounded-lg"
                  : "text-white"
                }`}
              role="menuitem"
              aria-expanded={isReportsOpen}
              aria-label="Reports"
            >
              <img
                src={activeItem === "reports" ? ActiveReportsIcon : ReportsIcon}
                alt="Reports Icon"
                className="w-5 h-5"
              />
              <span className="ml-4">Reports</span>
              {isReportsOpen ? (
                <ArrowDropUp className="ml-auto" />
              ) : (
                <ArrowRightIcon className="ml-auto" />
              )}
            </div>

            {/* Reports Submenu */}
            <Collapse style={{ margin: "0px" }} in={isReportsOpen}>
              <div className="pl-6 space-y-4">
                {[{ label: "User Reports", route: "/userreports" },
                { label: "Order Reports", route: "/orderreports" },
                { label: "Payment Reports", route: "/paymentreports" },
                { label: "Revenue Reports", route: "/revenuereports" },
                ].map((report) => (
                  <div
                    key={report.label}
                    onClick={(e) =>
                      handleClick(report.label, report.route, true, e)
                    }
                    className={`flex items-center cursor-pointer p-2 m-4 text-[12px] ${activeReport === report.label || location.pathname.includes(report.route)
                        ? "bg-[#F3E6F2] text-[#660F5D] rounded-lg"  // Slightly lighter background for the selected report option
                        : "text-white"
                      }`}
                    role="menuitem"
                    aria-label={report.label}
                  >
                    {/* <ArrowRightIcon className="w-5 h-5 mr-2" /> */}
                    {report.label}
                  </div>
                ))}
              </div>
            </Collapse>

            {renderNavItem(
              SettingsIcon,
              ActiveSettingsIcon,
              "Settings",
              "settings",
              "/settings"
            )}

            {/* Logout Option */}
            <div
              onClick={handleLogout}
              className="flex items-center cursor-pointer p-2 m-4 text-[12px] text-white rounded-lg"
              role="menuitem"
              aria-label="Logout"
            >
              <LogoutIcon className="w-5 h-5 mr-4" />
              <span>Logout</span>
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
