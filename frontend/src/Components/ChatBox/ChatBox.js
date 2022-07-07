import React, { useEffect, useState } from "react";
import "./ChatBox.css";

export function ChatBox({ chat, setChat, socket }) {
  const [inputBox, setInputBox] = useState("");

  function handleNewMessage() {
    setChat(...chat, inputBox);

    socket.emit("message", inputBox);
    setInputBox("");
    console.log("wahoo");
  }

  useEffect(() => {
    console.log(inputBox);
  });

  return (
    <div className="main">
      {chat.map((message) => (
        <p>{message}</p>
      ))}
      <input onchange={(e) => console.log(e.target.value)}></input>
      <button onclick="handleNewMessage()">send</button>
    </div>
  );
}
