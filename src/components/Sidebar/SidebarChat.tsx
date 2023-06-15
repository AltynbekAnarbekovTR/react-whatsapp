import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import "./SidebarChat.css";
import { Link } from "react-router-dom";
import { useStateValue } from "../../StateProvider";
import { actionTypes } from "../../reducer";
import { useAppDispatch } from "../../hooks/typedStoreHooks";
import { messengerActions } from "../../store/store";

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

  // const [messages, setMessages] = useState("");

  // useEffect(() => {
  //   if (id) {
  //     db.collection("rooms")
  //       .doc(id)
  //       .collection("messages")
  //       .orderBy("timestamp", "desc")
  //       .onSnapshot((snapshot) => {
  //         setMessages(snapshot.docs.map((doc) => doc.data()));
  //       });
  //   }
  // }, [id]);

  useEffect(() => {
    const seed = Math.floor(Math.random() * 5000);
    setSeed("" + seed);
  }, []);

  const createChat = () => {
    //996771215193@c.us
    const phoneNumInput = prompt(
      "Please Enter Phone Number you want to chat with"
    );

    if (phoneNumInput) {
      // dispatch({
      //   type: actionTypes.SET_NUMBER,
      //   //   user: result.user,
      //   phoneNumInput,
      // });
      disptach(messengerActions.addChat(phoneNumInput));
    }
  };

  return !addNewChat ? (
    <Link to={`/rooms/${phoneNum}`} key={id}>
      <div className="sidebarChat">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="sidebarChat_info">
          <h2>
            {/* {name} */}
            {phoneNum}
          </h2>
          <p>
            {/* {messages[0]?.message} */}
            First Message
          </p>
        </div>
      </div>
    </Link>
  ) : (
    <div onClick={createChat} className="sidebarChat">
      <h3 className="add-new-chat-title">Add New Chat</h3>
    </div>
  );
}

export default SidebarChat;
