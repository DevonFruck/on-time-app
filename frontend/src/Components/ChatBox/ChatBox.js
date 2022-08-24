import React, { useState } from "react";
import { Button, TextField } from "@material-ui/core";
import "./ChatBox.css";

export function ChatBox({ chat, setChat, name, socket }) {
  const [inputText, setInputText] = useState("");

  function handleNewMessage() {
    const msgObj = {
      name: name,
      message: inputText,
    };

    setChat((oldChat) => [...oldChat, msgObj]);
    socket.emit("NewMessage", msgObj);
    setInputText("");
  }

  return (
    <div className="main">
      <div className="message-history">
        {chat.map((message, index) => (
          <div className="message" key={index}>
            <b>{message.name}: </b> {message.message}
          </div>
        ))}
      </div>
      <div className="message-box">
        <TextField
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && inputText.trim()) handleNewMessage();
          }}
        />
        <Button
          onClick={() => {
            if (inputText.trim()) handleNewMessage();
          }}
        >
          Send
        </Button>
      </div>
    </div>
  );
}
