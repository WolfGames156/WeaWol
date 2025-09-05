
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-sky-300"></div>
    </div>
  );
};

export default Loader;
