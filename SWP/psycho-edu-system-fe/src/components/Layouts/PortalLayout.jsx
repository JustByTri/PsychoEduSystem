import React from 'react';
import { Outlet } from 'react-router-dom';

const PortalLayout = () => {
  return (
    <div className="portal-layout">
      {/* Add your portal layout structure here */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default PortalLayout;