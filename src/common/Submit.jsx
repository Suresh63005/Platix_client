import React from 'react'

const Submit = () => {
  return (
    <div>
            <div className="flex justify-end gap-3 mt-4">
            <button type='reset' className="bg-white text-gray-500 px-7 py-1 rounded-md border border-gray-300 text-sm">
              Cancel
            </button>
            <button type='submit' className="bg-[#660F5D] text-white px-7 py-1 rounded-md text-sm">
              Save
            </button>
          </div>
    </div>
  )
}

export default Submit
