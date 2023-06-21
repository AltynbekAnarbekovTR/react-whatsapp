import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Avatar, IconButton } from "@mui/material";
import {
  AttachFile,
  MoreVert,
  SearchOutlined,
  Mic,
  InsertEmoticon,
} from "@mui/icons-material";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { messengerAsyncActions } from "../../store/messengerSlice";
import "./Chat.css";

const Chat = () => {
  const [message, setInput] = useState("");
  const { currentChatNum } = useParams();
  const chats = useAppSelector((state) => state.messenger.chats);
  const pending = useAppSelector((state) => state.messenger.pending);
  const currentChat = chats.find(
    (chat) => chat.chatPhoneNum === currentChatNum
  );
  const avatarUrl = currentChat?.avatarUrl;

  const dispatch = useAppDispatch();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!pending) {
      interval = setInterval(() => {
        dispatch(messengerAsyncActions.receiveMessage());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [pending]);

  const sendMessageHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentChatNum && message.length) {
      dispatch(
        messengerAsyncActions.sendMessage({
          currentChatNumber: currentChatNum,
          message,
        })
      );
    }
    setInput("");
  };

  return (
    <div className="chat">
      <div className="chat_header">
        <Avatar src={avatarUrl} />
        <div className="chat_headerInfo">
          <h3 className="chat-room-name">{"+" + currentChatNum}</h3>
          <p className="chat-room-last-seen">Last seen </p>
        </div>
        <div className="chat_headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className="chat_body">
        {currentChat &&
          currentChat.messages.map((message) => (
            <div
              key={message.id}
              className={`chat_message ${
                message.sentByOwner && "chat_receiver"
              }`}
            >
              <span className="chat_name"></span>
              {message.message}
              <p className="chat_timestamp">{message.messageTime}</p>
            </div>
          ))}
      </div>
      <div className="chat_footer">
        <InsertEmoticon />
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
        <Mic />
      </div>
    </div>
  );
};

export default Chat;
