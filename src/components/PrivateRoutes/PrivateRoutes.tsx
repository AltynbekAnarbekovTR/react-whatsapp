import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../hooks/useAppSelector";
import { selectLoggedIn } from "../../store/selectLoggedIn";

const PrivateRoutes = () => {
  const loggedIn = useAppSelector(selectLoggedIn);

  return loggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
