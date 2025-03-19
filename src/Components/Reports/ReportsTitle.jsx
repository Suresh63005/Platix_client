import { useNavigate } from 'react-router-dom';
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";


const ReportsTitle = ({
  title,
  searchPlaceholder,
  onSearch,
  onDownloadClick,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
}) => {

  const navigate = useNavigate();
  
  const handleBackClick = () => {
    navigate(-1);
  };
  return (
    <div className="flex flex-col md:flex-row justify-between items-center p-4 space-y-4 md:space-y-0">
      <div className="font-medium text-left w-full md:w-auto">
      <h3
  className="flex items-center text-lg font-medium cursor-pointer"
  onClick={handleBackClick}
>
  <NavigateBeforeIcon className="mr-1" />
  {title}
</h3>
      </div>

      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
        {/* From Date Input */}
        <div className="relative w-full sm:w-[150px]">
          <input
            type="date"
            value={fromDate}
            onChange={onFromDateChange}
            className="p-2 border rounded-md text-[12px] w-full"
          />
        </div>

        {/* To Date Input */}
        <div className="relative w-full sm:w-[150px]">
          <input
            type="date"
            value={toDate}
            onChange={onToDateChange}
            className="p-2 border rounded-md text-[12px] w-full"
          />
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-[250px]">
          <input
            type="text"
            placeholder={searchPlaceholder || "Search"}
            onChange={onSearch}
            className="p-2 border rounded-md w-full"
          />
        </div>

        {/* Download Button */}
        <button onClick={onDownloadClick} className="bg-[#660F5D] text-white px-4 py-2 rounded">
          Download
        </button>
      </div>
    </div>
  );
};

export default ReportsTitle;
