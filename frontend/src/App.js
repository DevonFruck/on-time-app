import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { LoginModal } from './Components'

import {
  TextField,
  Button,
  Checkbox,
  Table,
  TableRow,
  TableBody,
  TableCell,
  Paper
} from "@material-ui/core";

function AvailableButtons({ editMode, setEditMode, enabled }) {
    if(!enabled) return;
    if(editMode) {
        return(
            <span className="title-btns">
                <Button onClick={() => setEditMode(false)}>
                    <CheckCircleIcon color='success'/>
                </Button>
            </span>
        )
    } else {
        return(
            <span className="title-btns">
                <Button onClick={() => setEditMode(true)}>
                    <EditIcon/>
                </Button>
            </span>
        )
    }
}

async function addTask(reqBody) {
  return await axios.put("http://localhost:3001/task/add", reqBody)
    .then( res => {
      return res.data.taskId;
    })
}

async function deleteTask(reqBody) {
  await axios.post("http://localhost:3001/task/remove", reqBody)
    .then( res => {
      return res.data;
    })
}

async function handleAddTask() {

}

async function handleDeleteTask() {

}


function App() {
  const [allTasks, setAllTasks] = useState([]);
  const [signedInUser, setSignedInUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [newTask, setNewTask] =  useState('');

  const fetchData = async () => {
    await axios.get("http://localhost:3001/task/get-all")
      .then( res => {
        setAllTasks(res.data)
        console.log(res.data)
      })
  }

  useEffect(() => {
    if (signedInUser !== null) {
      fetchData()
    }
  }, [signedInUser]);

  useEffect(() => {
    console.log(allTasks)
  }, [allTasks]);

  return (
    <div className="App">
      {signedInUser ?
        Object?.entries(allTasks)?.map((user) => {
        const userId = parseInt(user[0]);
        const userData = user[1];

        return (
          <Paper elevation={4} className="user-card">
            <div className="name-bar">
                {userData.name}
                <AvailableButtons editMode={editMode} setEditMode={setEditMode} enabled={userId === signedInUser}/>
            </div>

            <Table>
              <TableBody>
                {userData.tasks.map((task) => {
                      return (
                        <TableRow align="left" className="task">
                          <TableCell>{task.title}</TableCell>
                          <TableCell align="right" className="checkbox">

                            {editMode ?
                              <Button
                                onClick={async () => {
                                  const reqBody = {
                                    userId: userId,
                                    taskId: task.taskId
                                  }
                                  await deleteTask(reqBody);

                                  let newUserData = JSON.parse(JSON.stringify(allTasks));

                                  newUserData[userId].tasks = newUserData[userId].tasks.filter(
                                    item => item.taskId !== task.taskId);
                                  
                                  setAllTasks(newUserData);
                                }}
                              >
                                <DeleteForeverIcon sx={{ color: "crimson" }}/>
                              </Button>
                             :
                            <Checkbox />
                            }
                          </TableCell>
                        </TableRow>
                      );
                    })
                  }
              </TableBody>
            </Table>
            {userId === signedInUser && (
              <span className="task-input">
                <TextField
                  value={newTask}
                  id="filled-basic"
                  label="Enter new task"
                  variant="filled"
                  size="small"
                  multiline
                  maxRows={3}
                  fullWidth={true}
                  onChange={ (event) => setNewTask(event.target.value)}
                />
                <Button
                  disabled={!newTask.trim()}
                  onClick={async () => {
                    let newState = allTasks;
                    
                    const newTaskObj = {
                      taskName: newTask,
                      userId: userId
                    }
                    
                    const newTaskId = await addTask(newTaskObj);

                    newState[userId].tasks.push({
                      taskId: newTaskId,
                      title: newTask,
                      isComplete: false,
                      //order: 4,
                    })

                    //setAllTasks(newState);
                    setNewTask('');
                  }}
                >
                  <SendIcon color={newTask.trim() ? "primary" : "default"} />
                </Button>
              </span>
            )}
          </Paper>
        );
      }) : null}
      <LoginModal signedInUser={signedInUser} setSignedInUser={setSignedInUser} />
    </div>
  );
}

export default App;
