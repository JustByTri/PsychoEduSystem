import React, { useState } from "react";
import "./ChatInput.css";
const ChatInput = (props) => {
  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();

    const isUserProvided = user && user !== "";
    const isMessageProvided = message && message !== "";

    if (isUserProvided && isMessageProvided) {
      props.sendMessage(user, message);
    } else {
      alert("Please insert an user and a message.");
    }
  };

  const onUserUpdate = (e) => {
    setUser(e.target.value);
  };

  const onMessageUpdate = (e) => {
    setMessage(e.target.value);
  };

  return (
    <form className="chat-input-form" onSubmit={onSubmit}>
      <h2>Send a Message</h2>
      <div className="form-group">
        <label htmlFor="user">User:</label>
        <input
          id="user"
          name="user"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          placeholder="Enter your username"
        />
      </div>
      <div className="form-group">
        <label htmlFor="message">Message:</label>
        <input
          type="text"
          id="message"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
        />
      </div>
      <button type="submit" className="submit-btn">
        Send
      </button>
    </form>
  );
};

export default ChatInput;
