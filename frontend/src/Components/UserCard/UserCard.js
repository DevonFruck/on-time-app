import React, { useState } from "react";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Checkbox,
  TextField,
} from "@material-ui/core";
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { addTask, removeTask, updateTaskStatus } from "../";
import "./UserCard.css";

export function UserCard({ userData, userId, hasInput, socket }) {
  const [editMode, setEditMode] = useState(false);
  const [taskInput, setTaskInput] = useState("");

  const completedAudio = new Audio("/completed.mp3");

  async function addNewTask() {
    const reqBody = {
      userId: userId,
      taskName: taskInput.trim(),
    };

    await addTask(reqBody);
    // socket.emit("AddServer", reqBody);
    setTaskInput("");
  }

  return (
    <div className="user-card">
      <div className="name-bar">
        {userData.name}
        <span className="title-btns">
          {hasInput ? (
            editMode ? (
              <Button onClick={() => setEditMode(false)}>
                <CheckCircleIcon color="success" />
              </Button>
            ) : (
              <Button onClick={() => setEditMode(true)}>
                <EditIcon />
              </Button>
            )
          ) : null}
        </span>
      </div>
      <Table>
        <TableBody>
          {userData?.tasks?.map((task) => {
            return (
              <TableRow key={task.taskId} align="left">
                <TableCell>{task.title}</TableCell>
                <TableCell align="right" className="checkbox" size="small">
                  {editMode ? (
                    <Button
                      onClick={async () => {
                        const reqBody = {
                          userId: userId,
                          taskId: task.taskId,
                        };
                        await removeTask(reqBody);
                        // socket.emit("RemoveServer", reqBody);
                      }}
                    >
                      <DeleteForeverIcon sx={{ color: "crimson" }} />
                    </Button>
                  ) : (
                    <Checkbox
                      checked={task.isComplete}
                      disabled={!hasInput}
                      disableRipple
                      style={{
                        color: hasInput ? "#00968a" : "#36454f",
                      }}
                      onChange={(e) => {
                        const reqBody = {
                          userId: userId,
                          taskId: task.taskId,
                          status: e.target.checked,
                        };
                        updateTaskStatus(reqBody);

                        if (e.target.checked === true) {
                          completedAudio.play();
                        }
                        // socket.emit("UpdateServer", reqBody);
                      }}
                    />
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {hasInput && (
        <span className="task-input">
          <TextField
            className="input-field"
            value={taskInput}
            id="filled-basic"
            label="Enter new task"
            variant="filled"
            size="small"
            multiline
            maxRows={3}
            fullWidth={true}
            onChange={(event) => {
              setTaskInput(event.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") addNewTask();
            }}
            sx={{ input: { color: "red" } }}
          />
          <Button disabled={!taskInput.trim()} onClick={() => addNewTask()}>
            <SendIcon />
          </Button>
        </span>
      )}
    </div>
  );
}
