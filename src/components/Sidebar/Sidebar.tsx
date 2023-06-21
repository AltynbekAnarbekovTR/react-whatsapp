import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import { Avatar, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LogoutIcon from "@mui/icons-material/Logout";
import Tooltip from "@mui/material/Tooltip";
import SidebarChat from "./SidebarChat";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { ChatType, messengerActions } from "../../store/messengerSlice";
import { authActions } from "../../store/authSlice";

function Sidebar() {
  const [input, setInput] = useState("");
  const ownerPhoneNum = useAppSelector((state) => state.auth.ownerPhoneNum);
  const chats = useAppSelector((state) => state.messenger.chats);
  const [seed, setSeed] = useState("");

  const dispatch = useAppDispatch();

  const createChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.length) {
      dispatch(messengerActions.addChat({ phoneNumInput: input }));
    }
  };

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000).toString());
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebar_header">
        <div className="sidebar_headerLeft">
          <Avatar
            src={`https://avatars.dicebear.com/api/adventurer-neutral/${seed}.svg`}
          />
          {ownerPhoneNum}
        </div>
        <div className="sidebar_headerRight">
          <IconButton>
            <DonutLargeIcon />
          </IconButton>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
          <Tooltip title="Logout">
            <IconButton onClick={() => dispatch(authActions.logout())}>
              <LogoutIcon style={{ color: "#e26464" }} />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <form onSubmit={createChat} className="sidebar_search">
        <div className="sidebar_searchContainer">
          <div className="sidebar_phoneInput">
            <span>+</span>
            <input
              value={input}
              pattern="[0-9]*"
              title="*Only numbers*"
              placeholder="Phone number"
              onChange={(e) => {
                setInput(e.target.value);
              }}
            />
          </div>
          <IconButton type="submit" size="small">
            <AddIcon className="plus" />
          </IconButton>
        </div>
      </form>
      <div className="sidebar_chats">
        {chats.map((chat: ChatType) => {
          return (
            <SidebarChat key={chat.chatPhoneNum} phoneNum={chat.chatPhoneNum} />
          );
        })}
      </div>
    </div>
  );
}

export default Sidebar;
