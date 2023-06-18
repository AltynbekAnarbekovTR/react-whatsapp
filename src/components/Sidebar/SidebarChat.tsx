import React from "react";
import { Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../hooks/useAppSelector";
import "./SidebarChat.css";

type SidebarChatProps = {
  id?: string;
  name?: string;
  phoneNum?: string;
};

function SidebarChat({ id, phoneNum }: SidebarChatProps) {
  const chats = useAppSelector((state) => state.chats);
  const currentSidebarChat = chats.find(
    (chat) => chat.chatPhoneNum === phoneNum
  );

  const lastMessage = currentSidebarChat?.messages.slice(-1)[0]?.message;

  return (
    <Link to={`/rooms/${phoneNum}`} key={id}>
      <div className="sidebarChat">
        <Avatar src={currentSidebarChat?.avatarUrl} />
        <div className="sidebarChat_info">
          <h2>{phoneNum}</h2>
          <p>{lastMessage}</p>
        </div>
      </div>
    </Link>
  );
}

export default SidebarChat;
