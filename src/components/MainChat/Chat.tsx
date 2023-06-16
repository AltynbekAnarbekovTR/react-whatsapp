import React, { useState, useEffect } from "react";
import { Avatar, Button, IconButton } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import MicIcon from "@mui/icons-material/Mic";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import "./Chat.css";
import { useParams } from "react-router-dom";
import { useStateValue } from "../../StateProvider";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../hooks/typedStoreHooks";
import {
  messengerActions,
  receiveMessage,
  sendMessage,
} from "../../store/store";

function Chat() {
  const [message, setInput] = useState("");
  const [seed, setSeed] = useState("");
  const { currentChatNum } = useParams();
  const chats = useAppSelector((state) => state.chats);
  const currentChat = chats.find(
    (chat) => chat.chatPhoneNum === currentChatNum
  );
  console.log("Here1");
  const dispatch = useAppDispatch();

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000).toString());
    // }, [roomId]);
  }, []);

  useEffect(() => {
    console.log("Here2");

    const interval = setInterval(() => {
      dispatch(receiveMessage());
      return () => clearInterval(interval);
    }, 2000);
    dispatch(receiveMessage());
    return () => clearInterval(interval);
  }, []);

  const sendMessageHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentChatNum && message.length) {
      dispatch(sendMessage({ currentChatNumber: currentChatNum, message }));
    }
    setInput("");
  };

  return (
    <div className="chat">
      <div className="chat_header">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="chat_headerInfo">
          <h3 className="chat-room-name">
            {/* {roomName} */}
            {/* Room Name */}
            {currentChatNum}
          </h3>
          <p className="chat-room-last-seen">
            Last seen{" "}
            {/* {new Date(
              messages[messages.length - 1]?.timestamp?.toDate()
            ).toUTCString()} */}
          </p>
        </div>
        <div className="chat_headerRight">
          <IconButton>
            <SearchOutlinedIcon />
          </IconButton>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className="chat_body">
        {/* <Button onClick={recieveMessageHandler}>Recieve message</Button> */}
        {currentChat &&
          currentChat.messages.map((message) => (
            <div
              key={message.id}
              className={`chat_message ${
                message.sentByOwner && "chat_receiver"
              }`}
            >
              <span className="chat_name">
                {/* {message.name} */}
                {/* Sender */}
                {/* {currentChatNum} */}
              </span>
              {message.message}
              <p className="chat_timestamp">
                {/* {new Date(message.timestamp?.toDate()).toUTCString()} */}
                {/* Date */}
                {message.messageTime}
              </p>
            </div>
          ))}
      </div>
      <div className="chat_footer">
        <InsertEmoticonIcon />
        <form>
          <input
            value={message}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Type a message"
          />
          <button type="submit" onClick={sendMessageHandler}>
            {" "}
            Send a Message
          </button>
        </form>
        <MicIcon />
      </div>
    </div>
  );
}

export default Chat;
