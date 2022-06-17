import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import LoginModal from './Components'

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
                    <CancelIcon sx={{ color: "crimson" }}/>
                </Button>
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



function App() {
  const [allTasks, setAllTasks] = useState([]);
  const [signedInUser, setSignedInUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [newTask, setNewTask] =  useState('');


  const fetchData = async () => {
    await axios.get("http://localhost:3001/task/get-all")
      .then( res => {
        console.log(res.data)
        setAllTasks(res.data)
      })
  }

  useEffect(() => {
    if (signedInUser) {
      fetchData()
    }
  }, [signedInUser]);

  return (
    <div className="App">
      {signedInUser ?
        Object.entries(allTasks).map((user) => {
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
                {Array.isArray(userData.tasks)
                  ? userData.tasks.map((task) => {
                      return (
                        <TableRow align="left" className="task">
                          <TableCell>{task.title}</TableCell>
                          <TableCell align="right" className="checkbox">

                            {editMode ?
                              <Button
                                onClick={() => {
                                  const reqBody = {
                                    userId: userId,
                                    taskId: task.id
                                  }

                                  deleteTask(reqBody);

                                  var updatedData = allTasks;
                                  updatedData[userId].tasks = updatedData[userId].tasks.filter(
                                    item => item.id !== task.id);
                                  setAllTasks(updatedData);
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
                  : null}
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
                    var newState = allTasks;
                    
                    const newTaskObj = {
                      taskName: newTask,
                      userId: userId
                    }
                    
                    const newTaskId = await addTask(newTaskObj);

                    newState[userId].tasks.push({
                      id: newTaskId,
                      title: newTask,
                      isComplete: false,
                      //order: 4,
                    })

                    setAllTasks(newState);
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
      <LoginModal signedInUser={signedInUser} setSignedInUser={setSignedInUser}/>
    </div>
  );
}

export default App;
