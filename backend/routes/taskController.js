var express = require("express");
var router = express.Router();
const dbQuery = require("../db/dbConnection");
const dbError = "Unexpected database error";
const socket = require("../bin/www");

/* PUT add a user task. */
router.put("/add", async function (req, response, next) {
  var taskName = req.body.taskName;
  var userId = req.body.userId;

  const queryString = `
    INSERT INTO public.tasks(user_id, task_name)
    VALUES (${userId}, '${taskName}')
    RETURNING task_id;
  `;

  await dbQuery(queryString)
    .then((res) => {
      const newTaskId = res.rows[0].task_id;
      socket.getSocket().emit("add", {
        userId: userId,
        taskName: taskName,
        taskId: newTaskId,
      });
      response.status(200).send({ taskId: newTaskId });
    })
    .catch((err) => {
      console.error(err);
      response.status(500).send(dbError);
    });
});

/* POST remove user task. */
router.post("/remove", async function (req, response, next) {
  var userId = req.body.userId;
  var taskId = req.body.taskId;

  const queryString = `
    DELETE FROM public.tasks
    WHERE task_id=${taskId} AND user_id=${userId}
  `;

  await dbQuery(queryString)
    .then((res) => {
      socket.getSocket().emit("remove", req.body);
      response.status(200).send(res.rows);
    })
    .catch((err) => {
      console.error(err);
      response.status(500).send(dbError);
    });
});

/* POST update user task. */
router.post("/status", async function (req, response, next) {
  const taskId = req.body.taskId;
  const userId = req.body.userId;
  const status = !!req.body.status;

  const queryString = `
    UPDATE public.tasks
    SET is_complete = ${status}
    WHERE task_id=${taskId} AND user_id=${userId};
  `;

  await dbQuery(queryString)
    .then((res) => {
      if (res.rowCount === 1) {
        socket.getSocket().emit("update", req.body);
        response.status(200).send("Successfully updated task");
      }
    })
    .catch((err) => {
      console.error(err);
      response.status(500).send(dbError);
    });
});

/* GET get all tasks */
router.get("/get-all", async function (req, response, next) {
  const queryString = `
    SELECT * FROM public.tasks t
    JOIN public.users u ON u.user_id= t.user_id
  `;

  await dbQuery(queryString)
    .then((res) => {
      var groupedData = {};
      res.rows.forEach((row) => {
        if (!(row.user_id in groupedData)) {
          groupedData[row.user_id] = { name: row.display_name, tasks: [] };
        }
        groupedData[row.user_id].tasks.push({
          taskId: row.task_id,
          title: row.task_name,
          isComplete: row.is_complete,
        });
      });
      response.status(200).send(groupedData);
    })
    .catch((err) => {
      console.error(err);
      response.status(500).send(dbError);
    });
});

module.exports = router;
