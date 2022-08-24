import React, { useState } from "react";
import { Button, TextField } from "@material-ui/core";
import "./ChatBox.css";

export function ChatBox({ chat, setChat, name, socket }) {
  const [inputText, setInputText] = useState("");

  function handleNewMessage() {
    setChat((oldChat) => [...oldChat, inputText]);
    socket.emit("NewMessage", inputText);
    setInputText("");
  }

  return (
    <div className="main">
      {chat.map((message) => (
        <div>
          <b>{name}: </b> {message}
        </div>
      ))}
      <TextField
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleNewMessage();
        }}
      />
      <Button onClick={() => handleNewMessage()}>Send</Button>
    </div>
  );
}
