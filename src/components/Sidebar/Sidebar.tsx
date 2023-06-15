import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import { Avatar, IconButton } from "@mui/material";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import SidebarChat from "./SidebarChat";
import { useStateValue } from "../../StateProvider";
import { useAppSelector } from "../../hooks/typedStoreHooks";

function Sidebar() {
  const ownerPhoneNum = useAppSelector((state) => state.ownerPhoneNum);
  const chats = useAppSelector((state) => state.chats);
  const [seed, setSeed] = useState("");
  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000).toString());
    // }, [roomId]);
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebar_header">
        <div className="sidebar_headerLeft">
          <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
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
        </div>
      </div>
      <div className="sidebar_search">
        <div className="sidebar_searchContainer">
          <SearchOutlinedIcon />
          <input type="text" placeholder="Search or start new chat" />
        </div>
      </div>
      <div className="sidebar_chats">
        <SidebarChat addNewChat={true} />
        {chats.map((chat) => {
          return (
            <SidebarChat key={chat.chatPhoneNum} phoneNum={chat.chatPhoneNum} />
          );
        })}
      </div>
    </div>
  );
}

export default Sidebar;
