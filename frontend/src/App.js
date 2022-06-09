import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';

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

function App() {

  const [allTasks, setAllTasks] = useState([]);

  //const [myTasks, setMyTasks] = useState([]);
  const [editModeTasks, setEditModeTasks] = useState([]);
  const [signedInUser, setSignedInUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [newTask, setNewTask] =  useState('');

  // TODO: fetch the initial data from backend
  useEffect(() => {
    const fetchData = async () => {
      const test = await axios.get("http://localhost:3001/users/get-all")
        .then( res => {
          setAllTasks(res.data)
          console.log(res.data)
        })
    }

    fetchData()

    //setAllTasks(data);
    setSignedInUser(1);
  }, []);

  return (
    <div className="App">
      {Object.entries(allTasks).map((user) => {
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
                            <Checkbox />
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
                  onClick={() => {
                    const newState = allTasks;
                    
                    newState[userId].tasks.push({
                      taskName: newTask,
                      isComplete: false,
                      order: 4,
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
      })}
    </div>
  );
}

export default App;
