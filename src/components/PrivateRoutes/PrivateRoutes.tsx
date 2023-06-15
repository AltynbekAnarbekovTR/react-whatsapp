// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";

// export const ProtectedLayout = () => {
//   const { user } = useAuth();

//   if (!user) {
//     return <Navigate to="/" />;
//   }

//   return (
//     <div>
//       <nav>
//         <Link to="/settings">Settings</Link>
//         <Link to="/profile">Profile</Link>
//       </nav>
//       <Outlet />
//     </div>
//   );
// };

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../hooks/typedStoreHooks";
import { selectLoggedIn } from "../../store/store";

const PrivateRoutes = () => {
  const loggedIn = useAppSelector(selectLoggedIn);

  return loggedIn ? (
    // <div className="app_body">
    <Outlet />
  ) : (
    // </div>
    <Navigate to="/" />
  );
};

export default PrivateRoutes;
