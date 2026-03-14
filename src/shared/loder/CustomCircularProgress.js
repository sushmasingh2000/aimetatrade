import React from 'react';

const CustomCircularProgress = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="loader-backdrop">
      <div className="loader-container">
        <div className="loader-spinner"></div>
      </div>
    </div>
  );
};

export default CustomCircularProgress;
