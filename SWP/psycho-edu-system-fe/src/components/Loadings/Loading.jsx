import React from 'react';

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        {/* You can customize the loading animation/spinner here */}
        <div className="spinner"></div>
      </div>
      <p>Loading...</p>
    </div>
  );
};

export default Loading;