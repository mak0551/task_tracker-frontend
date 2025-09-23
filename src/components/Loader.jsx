import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
    </div>
  );
};

export default Loader;
