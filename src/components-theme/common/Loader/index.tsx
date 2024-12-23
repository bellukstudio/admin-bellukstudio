import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-whit  dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
    </div>
  );
};

export default Loader;
