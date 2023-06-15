import React from "react";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="app green-line">
      <Outlet />
    </div>
  );
};

export default AppLayout;
