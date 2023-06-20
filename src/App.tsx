import React, { useEffect } from "react";
import { Routes, Route, Outlet, Navigate, useNavigate } from "react-router-dom";
import { useAppSelector } from "./hooks/useAppSelector";
import Sidebar from "./components/Sidebar/Sidebar";
import Chat from "./components/MainChat/Chat";
import Login from "./components/Login/Login";
import PrivateRoutes from "./components/PrivateRoutes/PrivateRoutes";
import AppLayout from "./components/Layouts/AppLayout";
import MessengerLayout from "./components/Layouts/MessengerLayout";
import { selectLoggedIn } from "./store/selectLoggedIn";
import "./App.css";
import NotFound from "./components/NotFound/NotFound";
import DummyChat from "./components/DummyChat/DummyChat";

function App() {
  const loggedIn = useAppSelector(selectLoggedIn);
  const error = useAppSelector((state) => state.error);
  const chats = useAppSelector((state) => state.chats);
  const nav = useNavigate();

  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

  useEffect(() => {
    if (loggedIn) {
      nav("/rooms");
    }
  }, []);

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route
          path="/"
          element={
            loggedIn ? <Navigate to="/rooms" /> : <Navigate to="/login" />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route element={<MessengerLayout />}>
          <Route element={<PrivateRoutes />}>
            <Route
              path="rooms"
              element={
                <>
                  <Sidebar />
                  {!chats.length && <DummyChat />}
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
        <Route path="/*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
