import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { messengerActions } from "../../store/store";
import AddIcon from "@mui/icons-material/Add";
import "./SidebarChat.css";

type SidebarChatProps = {
  id?: string;
  name?: string;
  addNewChat?: boolean;
  phoneNum?: string;
};

function SidebarChat({ id, phoneNum, addNewChat }: SidebarChatProps) {
  const [seed, setSeed] = useState("");
  const disptach = useAppDispatch();
  const chats = useAppSelector((state) => state.chats);
  const { currentChatNum } = useParams();

  const currentChat = chats.find(
    (chat) => chat.chatPhoneNum === currentChatNum
  );
  const lastMessage = currentChat?.messages.slice(-1)[0]?.message;

  useEffect(() => {
    const seed = Math.floor(Math.random() * 5000);
    setSeed("" + seed);
  }, []);

  const createChat = () => {
    const phoneNumInput = prompt(
      "Please Enter Phone Number you want to chat with"
    );
    if (phoneNumInput) {
      disptach(messengerActions.addChat(phoneNumInput));
    }
  };

  return !addNewChat ? (
    <Link to={`/rooms/${phoneNum}`} key={id}>
      <div className="sidebarChat">
        <Avatar
          src={`https://avatars.dicebear.com/api/adventurer-neutral/${seed}.svg`}
        />
        <div className="sidebarChat_info">
          <h2>{phoneNum}</h2>
          <p>
            {/* {messages[0]?.message} */}
            {lastMessage}
          </p>
        </div>
      </div>
    </Link>
  ) : (
    <div onClick={createChat} className="sidebarChat addNewChat">
      <h3 className="add-new-chat-title">Add New Chat</h3>
      <AddIcon />
    </div>
  );
}

export default SidebarChat;
