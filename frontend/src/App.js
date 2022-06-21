import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LoginModal,
  UserCard,
  getAllTasks,
  addTask,
  removeTask,
  updateTaskStatus,
} from "./Components";
import "./App.css";

function App() {
  const [allTasks, setAllTasks] = useState({});
  const [signedInUser, setSignedInUser] = useState(null);
  const [userDisplayName, setUserDisplayName] = useState(null);

  const fetchData = async () => {
    let tasks = await getAllTasks();

    /*
    Adds the logged in user to the list if not already
    This makes it so their task card still shows up
    although their task list is empty */
    if (!tasks[signedInUser]) {
      tasks[signedInUser] = {
        name: userDisplayName,
        tasks: [],
      };
    }

    setAllTasks(tasks);
  };

  async function handleAddTask(userId, newTaskName, displayName) {
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

    await axios
      .post("http://localhost:3001/task/remove", reqBody)
      .then((res) => {
        return res.data;
      });
  }

  useEffect(() => {
    if (signedInUser !== null) {
      fetchData();
    }
  }, [signedInUser]);

  return (
    <div className="App">
      {signedInUser &&
        Object?.entries(allTasks)?.map((user) => {
          const userId = parseInt(user[0]);
          const userData = user[1];

          return (
            <UserCard
              userData={userData}
              userId={userId}
              hasInput={userId === signedInUser}
              handleDeleteTask={handleDeleteTask}
              handleAddTask={handleAddTask}
              handleStatusChange={handleStatusChange}
            />
          );
        })}
      <LoginModal
        signedInUser={signedInUser}
        setSignedInUser={setSignedInUser}
        setUserDisplayName={setUserDisplayName}
      />
    </div>
  );
}

export default App;
