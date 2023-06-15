import React from "react";
import { Outlet } from "react-router-dom";

const MessengerLayout = () => {
  return (
    <div className="app_body">
      <Outlet />
    </div>
  );
};

export default MessengerLayout;
