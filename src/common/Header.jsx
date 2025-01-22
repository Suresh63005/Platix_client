import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as UserIcon } from "../assets/images/icon.svg";

const Header = ({ name }) => {
  const navigate = useNavigate();

  const navigateToAccount = () => {
    navigate('/Account');
  };

  return (
    <div>
      <div className="header-container flex justify-between items-center h-[60px] bg-white p-3 ml-0 pl-5">
        {/* Hide title on small screens */}
        <div className="users-title text-[24px] font-extrabold hidden sm:block">{name}</div>

        {/* Account icon (always on the right side) */}
        <div className="account-icon ml-auto bg-[#F3E6F2] rounded-full p-2" onClick={navigateToAccount}>
          <UserIcon className="w-6 h-6" /> {/* Adjust size using Tailwind classes */}
        </div>
      </div>
    </div>
  );
};

export default Header;
