import React from 'react';
import { ReactComponent as Cancelbtnicon } from "../assets/images/Cancel_button_icon.svg";

const Submit = () => {
  return (
    <div>
      <div className="flex justify-end gap-3 mt-4">
        <button
          type="reset"
          className="flex items-center bg-white text-gray-500 px-4 py-1 rounded-md border border-gray-300 text-sm gap-2"
        >
          <Cancelbtnicon className="w-4 h-4" /> {/* Icon added here */}
          Cancel
        </button>
        <button
          type="submit"
          className="bg-[#660F5D] text-white px-7 py-1 rounded-md text-sm"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Submit;
