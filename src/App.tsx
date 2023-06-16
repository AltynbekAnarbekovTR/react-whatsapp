import "./App.css";
import React, { useEffect } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Chat from "./components/MainChat/Chat";
import Login from "./components/Login/Login";
import { Routes, Route, Outlet, useNavigate } from "react-router-dom";
import { useAppSelector } from "./hooks/typedStoreHooks";
import PrivateRoutes from "./components/PrivateRoutes/PrivateRoutes";
import AppLayout from "./components/Layouts/AppLayout";
import MessengerLayout from "./components/Layouts/MessengerLayout";
import { selectLoggedIn } from "./store/store";

function App() {
  console.log("window.location.href: ", window.location.href);

  const loggedIn = useAppSelector(selectLoggedIn);
  const error = useAppSelector((state) => state.error);
  const idInstance = useAppSelector((state) => state.idInstance);
  const apiTokenInstance = useAppSelector((state) => state.apiTokenInstance);
  const ownerPhoneNum = useAppSelector((state) => state.ownerPhoneNum);
  const chats = useAppSelector((state) => state.chats);

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
            {/* <Route
              path="rooms/*"
              element={
                <>
                  <Sidebar />
                  <Routes>
                    <Route path=":currentChatNum" element={<Chat />} />
                  </Routes>
                </>
              }
            /> */}
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
