import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../hooks/useAppSelector";
import { selectLoggedIn } from "../../store/store";

const PrivateRoutes = () => {
  const loggedIn = useAppSelector(selectLoggedIn);
  const pending = useAppSelector((state) => state.pending);
  console.log("Private Route");

  return loggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
