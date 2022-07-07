import React, { useEffect, useState } from "react";
import {
  LoginModal,
  UserCard,
  getAllTasks,
  Loader,
  ChatBox,
} from "./Components";
import io from "socket.io-client";
import "./App.css";

function App() {
  const [allTasks, setAllTasks] = useState({});
  const [chat, setChat] = useState(["wahooo", "hooya"]);
  const [signedInUser, setSignedInUser] = useState(null);
  const [userDisplayName, setUserDisplayName] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    socket?.on("update", (data) => {
      handleStatusChange(data.userId, data.taskId, data.status);
    });

    socket?.on("add", (data) => {
      handleAddTask(data.userId, data.taskId, data.taskName);
    });

    socket?.on("remove", (data) => {
      handleDeleteTask(data.userId, data.taskId);
    });

    socket?.on("remove", (data) => {
      handleDeleteTask(data.userId, data.taskId);
    });

    //Appends a chat message
    socket?.on("message", (data) => {
      setChat(...chat, data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allTasks, chat]);

  async function handleAddTask(userId, taskId, newTaskName) {
    let newState = JSON.parse(JSON.stringify(allTasks));

    newState[userId]?.tasks.push({
      taskId: taskId,
      title: newTaskName,
      isComplete: false,
      //order: 4,
    });

    setAllTasks(newState);
  }

  async function handleDeleteTask(userId, taskId) {
    let newUserData = JSON.parse(JSON.stringify(allTasks));

    newUserData[userId].tasks = await newUserData[userId].tasks.filter(
      (item) => item.taskId !== taskId
    );

    setAllTasks(newUserData);
  }

  async function handleStatusChange(userId, taskId, status) {
    let newData = JSON.parse(JSON.stringify(allTasks));

    newData[userId]?.tasks.every((task) => {
      if (task.taskId === taskId) {
        task.isComplete = status;
        return false;
      }
      return true;
    });

    setAllTasks(newData);
  }

  useEffect(() => {
    const fetchData = async () => {
      let tasks = await getAllTasks();

      /*
      Adds the logged in user to the list if not already
      This makes it so their task card still shows up
      although their task list is empty */
      if (tasks[signedInUser] === undefined) {
        tasks[signedInUser] = {
          name: userDisplayName,
          tasks: [],
        };
      }
      setAllTasks(tasks);
    };

    if (signedInUser !== null) {
      fetchData();
      setSocket(io.connect("http://localhost:3001"));
    }
  }, [signedInUser, userDisplayName]);

  return (
    <>
      <div className="title-row">On Time!</div>
      <div className="content-section">
        <ChatBox chat={chat} setChat={setChat} socket={socket} />
        <div className="usercard-section">
          {signedInUser ? (
            Object?.entries(allTasks)?.map((user) => {
              const userId = parseInt(user[0]);
              const userData = user[1];

              return (
                <UserCard
                  key={userId}
                  userData={userData}
                  userId={userId}
                  hasInput={userId === signedInUser}
                  handleDeleteTask={handleDeleteTask}
                  handleAddTask={handleAddTask}
                  handleStatusChange={handleStatusChange}
                />
              );
            })
          ) : (
            <Loader />
          )}
          <LoginModal
            signedInUser={signedInUser}
            setSignedInUser={setSignedInUser}
            setUserDisplayName={setUserDisplayName}
          />
        </div>
      </div>
    </>
  );
}

export default App;
