import "./App.css";
import React, { useState, useContext, useEffect } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Chat from "./components/MainChat/Chat";
import Login from "./components/Login/Login";
import { Routes, Route, Navigate, Outlet, useNavigate } from "react-router-dom";
import { StateContext, useStateValue } from "./StateProvider";
import { Container } from "@mui/material";
import { useAppSelector } from "./hooks/typedStoreHooks";
import { BrowserRouter as Router } from "react-router-dom";
import PrivateRoutes from "./components/PrivateRoutes/PrivateRoutes";
import NotFound from "./components/NotFound/NotFound";
import AppLayout from "./components/Layouts/AppLayout";
import MessengerLayout from "./components/Layouts/MessengerLayout";
import { Button } from "react-bootstrap";
import { selectLoggedIn } from "./store/store";

function App() {
  const loggedIn = useAppSelector(selectLoggedIn);
  const error = useAppSelector((state) => state.error);
  const idInstance = useAppSelector((state) => state.idInstance);
  const apiTokenInstance = useAppSelector((state) => state.apiTokenInstance);
  const ownerPhoneNum = useAppSelector((state) => state.ownerPhoneNum);
  const chats = useAppSelector((state) => state.chats);
  console.log("chats in App: ", chats);

  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      alert("error");
    }
  }, [error]);
  useEffect(() => {
    if (loggedIn) {
      navigate("/rooms");
    } else {
      navigate("/login");
    }
  }, [loggedIn]);
  useEffect(() => {
    const serializedState = JSON.stringify({
      idInstance,
      apiTokenInstance,
      ownerPhoneNum,
    });
    localStorage.setItem("authState", serializedState);
  }, [loggedIn]);

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/login" element={<Login />} />
        <Route element={<MessengerLayout />}>
          <Route element={<PrivateRoutes />}>
            <Route
              path="rooms/*"
              element={
                <>
                  <Sidebar />
                  <Routes>
                    <Route path=":currentChatNum" element={<Chat />} />
                  </Routes>
                </>
              }
            />
          </Route>
        </Route>
        {/* <Route path="/*" element={<NotFound />} /> */}
      </Route>
    </Routes>

    // <Routes>
    //   <Route element={<AppLayout />}>
    //     <Route
    //       path="/"
    //       element={
    //         <>
    //           <Button
    //             onClick={() => {
    //               navigate();
    //             }}
    //           >
    //             Click
    //           </Button>
    //           <Login />
    //         </>
    //       }
    //     />
    //     <Route element={<MessengerLayout />}>
    //       <Route element={<PrivateRoutes />}>
    //         <Route
    //           path="/*"
    //           element={
    //             <>
    //               <Sidebar />
    //               <Routes>
    //                 <Route path="/rooms/:currentChatNum" element={<Chat />} />
    //               </Routes>
    //             </>
    //           }
    //         />
    //       </Route>
    //       {/* <Route path="/*" element={<NotFound />} /> */}
    //     </Route>
    //   </Route>
    // </Routes>
  );
}

export default App;
