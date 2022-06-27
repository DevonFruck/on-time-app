import React, { useEffect, useState } from "react";
import {
  LoginModal,
  UserCard,
  getAllTasks,
  addTask,
  removeTask,
  updateTaskStatus,
  Loader,
} from "./Components";
import io from "socket.io-client";
import "./App.css";

function App() {
  const [allTasks, setAllTasks] = useState({});
  const [signedInUser, setSignedInUser] = useState(null);
  const [userDisplayName, setUserDisplayName] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    socket?.on("update", (message) => {
      console.log("we updatinggg");
    });
  }, [socket]);

  async function handleAddTask(userId, newTaskName) {
    let newState = allTasks;

    const reqBody = {
      taskName: newTaskName,
      userId: userId,
    };
    const newTaskId = await addTask(reqBody);

    newState[userId].tasks.push({
      taskId: newTaskId,
      title: newTaskName,
      isComplete: false,
      //order: 4,
    });

    setAllTasks(newState);
  }

  async function handleDeleteTask(userId, taskId) {
    const reqBody = {
      userId: userId,
      taskId: taskId,
    };
    await removeTask(reqBody);

    let newUserData = JSON.parse(JSON.stringify(allTasks));

    newUserData[userId].tasks = newUserData[userId].tasks.filter(
      (item) => item.taskId !== taskId
    );

    setAllTasks(newUserData);
  }

  async function handleStatusChange(userId, taskId, status) {
    const reqBody = {
      userId: userId,
      taskId: taskId,
      newStatus: status,
    };

    await updateTaskStatus(reqBody).then((res) => {
      return res.data;
    });
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
    </>
  );
}

export default App;
