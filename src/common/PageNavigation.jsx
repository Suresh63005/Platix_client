import React from "react";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

const PageNavigation = ({ title, onBackClick }) => {
  return (
    <div className="page-navigation flex items-center  px-6 py-5  mb-5 border-gray-300">
      <h3
        className="flex items-center text-lg font-medium cursor-pointer"
        onClick={onBackClick}
      >
        <NavigateBeforeIcon className="mr-1" />
        {title}
      </h3>
    </div>
  );
};

export default PageNavigation;
