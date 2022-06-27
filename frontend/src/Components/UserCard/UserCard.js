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
import "./UserCard.css";

export function UserCard({
  userData,
  userId,
  hasInput,
  handleDeleteTask,
  handleAddTask,
  handleStatusChange,
}) {
  const [editMode, setEditMode] = useState(false);
  const [taskInput, setTaskInput] = useState("");

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
                <TableCell align="right" className="checkbox">
                  {editMode ? (
                    <Button
                      onClick={async () =>
                        handleDeleteTask(userId, task.taskId)
                      }
                    >
                      <DeleteForeverIcon sx={{ color: "crimson" }} />
                    </Button>
                  ) : (
                    <Checkbox
                      defaultChecked={task.isComplete}
                      disabled={!hasInput}
                      disableRipple
                      onChange={(e) =>
                        handleStatusChange(userId, e.target.checked)
                      }
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
            sx={{ input: { color: "red" } }}
          />
          <Button
            disabled={!taskInput.trim()}
            onClick={async () => {
              await handleAddTask(userId, taskInput.trim());
              setTaskInput("");
            }}
          >
            <SendIcon />
          </Button>
        </span>
      )}
    </div>
  );
}
