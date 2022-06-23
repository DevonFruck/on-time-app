import React, { useState } from "react";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Checkbox,
  TextField,
  Paper,
} from "@material-ui/core";
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

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
    <Paper elevation={4} className="user-card">
      <div className="name-bar">
        {userData.name}
        <span className="title-btns">
          {editMode ? (
            <Button onClick={() => setEditMode(false)}>
              <CheckCircleIcon color="success" />
            </Button>
          ) : (
            <Button onClick={() => setEditMode(true)}>
              <EditIcon />
            </Button>
          )}
        </span>
      </div>
      <Table>
        <TableBody>
          {userData?.tasks?.map((task) => {
            return (
              <TableRow align="left" className="task">
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
                      onChange={(e) => handleStatusChange(userId, e.target.checked)}
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
          />
          <Button
            disabled={!taskInput.trim()}
            onClick={async () => {
              await handleAddTask(userId, taskInput.trim());
              setTaskInput("");
            }}
          >
            <SendIcon color={taskInput.trim() ? "primary" : "default"} />
          </Button>
        </span>
      )}
    </Paper>
  );
}
