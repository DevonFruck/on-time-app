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
  let data = [
    {
      name: "Devon",
      id: 12,
      tasks: [
        {
          taskName: "mow the grass",
          isComplete: false,
          order: 1,
        },
        {
          taskName: "eat some tea",
          isComplete: true,
          order: 3,
        },
        {
          taskName: "cry",
          isComplete: false,
          order: 2,
        },
      ],
    },
    {
      name: "Johnny",
      id: 52,
      tasks: [
        {
          taskName: "woohoo ur dad",
          isComplete: false,
        },
        {
          taskName: "sleep",
          isComplete: true,
        },
        {
          taskName: "snore",
          isComplete: false,
        },
      ],
    },
  ];

  const [allTasks, setAllTasks] = useState([]);

  //const [myTasks, setMyTasks] = useState([]);
  const [editModeTasks, setEditModeTasks] = useState([]);
  const [signedInUser, setSignedInUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [newTask, setNewTask] =  useState('');

  // TODO: fetch the initial data from backend
  useEffect(() => {
    // const fetchData = async () => {
    //   await axios.get("http://localhost:3001/users")
    //     .then( res => {
    //       //setAllTasks(res)
    //       console.log(res)
    //     })
    // }

    //fetchData()

    setAllTasks(data);
    setSignedInUser(12);
  }, []);

  return (
    <div className="App">
      {allTasks.map((user) => {
        return (
          <Paper elevation={4} className="user-card">
            <div className="name-bar">
                {user.name}
                <AvailableButtons editMode={editMode} setEditMode={setEditMode} enabled={user.id === signedInUser}/>
            </div>

            <Table>
              <TableBody>
                {Array.isArray(user.tasks)
                  ? user.tasks.map((task) => {
                      return (
                        <TableRow align="left" className="task">
                          <TableCell>{task.taskName}</TableCell>
                          <TableCell align="right" className="checkbox">
                            <Checkbox />
                          </TableCell>
                        </TableRow>
                      );
                    })
                  : null}
              </TableBody>
            </Table>
            {user.id === signedInUser && (
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
                    const newState = allTasks.map((user) => {
                      if (user.id === 12) {
                        user.tasks.push({
                          taskName: newTask,
                          isComplete: false,
                          order: 4,
                        });
                      }
                      return user;
                    });
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
