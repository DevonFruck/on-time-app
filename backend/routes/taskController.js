var express = require('express');
var router = express.Router();
const dbQuery = require('../db/dbConnection');
const dbError = 'Unexpected database error';


/* PUT add a user task. */
router.put('/add', async function(req, response, next) {

  var taskName = req.body.taskName;
  var userId = req.body.userId;

  const queryString = `
    INSERT INTO public.tasks(user_id, task_name)
    VALUES (${userId}, '${taskName}')
    RETURNING task_id;
  `

  await dbQuery(queryString)
  .then(res => {
    response.status(200).send({taskId: res.rows[0].task_id})})
  .catch((err) => { 
    console.error(err);
    response.status(500).send(dbError);
  })
});

/* PUT user task. */
router.post('/remove', async function(req, response, next) {

  var userId = req.body.userId;
  var taskId = req.body.taskId;

  const queryString = `
    DELETE FROM public.tasks
    WHERE task_id=${taskId} AND user_id=${userId}
  `

  await dbQuery(queryString)
  .then(res => { response.status(200).send(res.rows)})
  .catch((err) => { 
    console.error(err);
    response.status(500).send(dbError);
  })
});

/* POST user update task. */
router.post('/status', async function(req, response, next) {
  const taskId = req.body.taskId;
  const userId = req.body.userId;
  const status = !!req.body.status;
  
  const queryString = `
    UPDATE public.tasks
    SET is_complete = ${status}
    WHERE task_id=${taskId} AND user_id=${userId};
  `

  await dbQuery(queryString)
  .then(res => { 
    if(res.rowCount === 1)
      response.status(200).send('Successfully updated task')})
  .catch((err) => { 
    console.error(err);
    response.status(500).send(dbError);
  })
});



router.get('/get-all', async function(req, response, next) {
  const queryString = `
    SELECT * FROM public.tasks
    JOIN public.users ON public.tasks.user_id=public.users.user_id
  `

  await dbQuery(queryString)
  .then( res => {
    var groupedData = {};
    res.rows.forEach(row => {
      if (!(row.task_id in groupedData)) {
        groupedData[row.user_id] = {name: row.display_name, tasks: []};
      }
      groupedData[row.user_id].tasks.push({taskId: row.task_id, title: row.task_name, isComplete: row.is_complete})
    })
    console.log(groupedData)
    response.status(200).send(groupedData);
  })
  .catch(err => {
    console.error(err)
    response.status(500).send(dbError)
  })
});

module.exports = router;
