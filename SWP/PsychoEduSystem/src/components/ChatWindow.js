import React from "react";
import Message from "./Message";
import "./ChatWindow.css";

const ChatWindow = (props) => {
  const chat = props.chat.map((m, index) => (
    <Message key={index} user={m.user} message={m.message} />
  ));

  return <div className="chat-window">{chat}</div>;
};

export default ChatWindow;
