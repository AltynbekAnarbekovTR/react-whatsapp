import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import "./SidebarChat.css";
import { Link, useMatch, useMatches, useParams } from "react-router-dom";
import { useStateValue } from "../../StateProvider";
import { actionTypes } from "../../reducer";
import IconButton from "@mui/material/IconButton";
import { useAppDispatch, useAppSelector } from "../../hooks/typedStoreHooks";
import { messengerActions } from "../../store/store";
import AddIcon from "@mui/icons-material/Add";

type SidebarChatProps = {
  id?: string;
  name?: string;
  addNewChat?: boolean;
  phoneNum?: string;
};

function SidebarChat({ id, phoneNum, addNewChat }: SidebarChatProps) {
  const [seed, setSeed] = useState("");
  // const [{}, dispatch] = useStateValue();
  const disptach = useAppDispatch();
  const chats = useAppSelector((state) => state.chats);
  const { currentChatNum } = useParams();
  // const matches = useMatches();
  // console.log("matches: ", matches);

  const currentChat = chats.find(
    (chat) => chat.chatPhoneNum === currentChatNum
  );
  // if (currentChat?.messages[0].message) {
  //   const firstMessage = currentChat?.messages[0].message || "";
  // }
  // console.log(
  //   "currentChat?.messages.slice(-1): ",
  //   currentChat?.messages.slice(-1)
  // );
  const lastMessage = currentChat?.messages.slice(-1)[0]?.message;

  // console.log("chats: ", chats);
  console.log("currentChat: ", currentChat);

  useEffect(() => {
    const seed = Math.floor(Math.random() * 5000);
    setSeed("" + seed);
  }, []);

  const createChat = () => {
    //  @c.us
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
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
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
