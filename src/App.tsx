import React, { useEffect } from "react";
import { Routes, Route, Outlet, useNavigate } from "react-router-dom";
import { useAppSelector } from "./hooks/useAppSelector";
import Sidebar from "./components/Sidebar/Sidebar";
import Chat from "./components/MainChat/Chat";
import Login from "./components/Login/Login";
import PrivateRoutes from "./components/PrivateRoutes/PrivateRoutes";
import AppLayout from "./components/Layouts/AppLayout";
import MessengerLayout from "./components/Layouts/MessengerLayout";
import { selectLoggedIn } from "./store/store";
import "./App.css";

function App() {
  const loggedIn = useAppSelector(selectLoggedIn);
  const error = useAppSelector((state) => state.error);
  const chats = useAppSelector((state) => state.chats);

  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);
  useEffect(() => {
    if (loggedIn) {
      navigate("/rooms");
    } else {
      navigate("/login");
    }
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
                  <Outlet />
                </>
              }
            >
              {chats.length && (
                <Route path=":currentChatNum" element={<Chat />} />
              )}
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
