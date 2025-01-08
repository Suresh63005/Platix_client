import React from 'react';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { ReactComponent as UserIcon } from "../assets/images/icon.svg";

const Header = ({ name }) => {
  return (
    <div>
      <div className="header-container flex justify-between items-center h-[75px] bg-white p-3 ml-0">
        {/* Hide title on small screens */}
        <div className="users-title text-xl font-bold hidden sm:block">{name}</div>

        {/* Account icon (always on the right side) */}
        <div className="account-icon ml-auto bg-[#F3E6F2] rounded-full p-2">
          <UserIcon className="w-6 h-6" /> {/* Adjust size using Tailwind classes */}
        </div>
      </div>
    </div>
  );
};

export default Header;
