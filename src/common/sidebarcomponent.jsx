import React from 'react';
import { Collapse } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';

const SidebarItem = ({ icon, label, activeItem, onClick, isOpen, subItems, onSubItemClick }) => {
  return (
    <>
      <li
        onClick={onClick}
        className={`flex items-center cursor-pointer mb-[16px] p-[10px] ml-4 mr-4 text-[12px] ${
          activeItem === label ? 'bg-white text-[#660F5D] rounded-lg' : 'text-white'
        }`}
      >
        {icon}
        <span className="ml-4">{label}</span>
        {subItems && (isOpen ? <ArrowDropUp className="ml-auto" /> : <ArrowDropDown className="ml-auto" />)}
      </li>

      {/* Submenu */}
      <Collapse in={isOpen}>
        <ul className="pl-6">
          {subItems &&
            subItems.map((item, index) => (
              <li
                key={index}
                onClick={() => onSubItemClick(item)}
                className={`flex items-center cursor-pointer mb-[16px] p-[10px] ml-4 mr-4 text-[12px] ${
                  activeItem === item ? 'bg-white text-[#660F5D] rounded-lg' : 'text-white'
                }`}
              >
                <ArrowRightIcon className="w-5 h-5 mr-2" />
                {item}
              </li>
            ))}
        </ul>
      </Collapse>
    </>
  );
};

export default SidebarItem;
