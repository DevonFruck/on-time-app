import axios from "axios";

export async function addTask(reqBody) {
    return await axios.put("http://localhost:3001/task/add", reqBody)
    .then( res => {
      return res.data.taskId;
    })
}

export async function removeTask(reqBody) {
    return await axios.post("http://localhost:3001/task/remove", reqBody)
    .then( res => {
      return res.data;
    })
}

export async function updateTaskStatus(reqBody) {
    return await axios.post("http://localhost:3001/task/status", reqBody)
    .then( res => {
      return res.data;
    })
}

export async function getAllTasks() {
    return await axios.get("http://localhost:3001/task/get-all")
      .then( res => {
        return res.data;
      })
}