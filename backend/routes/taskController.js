var express = require('express');
var router = express.Router();
const dbQuery = require('../db/dbConnection');

/* GET users tasks. DEPRECATED */
router.get('/', async function(req, response, next) {

  let groupedData = {};
  var result = await 
  dbQuery('SELECT * FROM public.tasks', (err, res) => {
      if (err) throw err

      res.rows.forEach(task => {
        if (!(task.name in groupedData)) {
            groupedData[task.name] = [];
        }
        groupedData[task.name].push({title: task.task_name, isComplete: task.is_complete})
      })
      response.send(groupedData)
  })
});

/* get all user task. */
router.get('/get-all', async function(req, response, next) {
  console.log('in the endpoint')
    getPool().connect();

    console.log('allah')
    let groupedData = {};
    getPool().connect().query(
      `
      SELECT * FROM public.tasks
      LEFT JOIN public.users ON public.tasks.id=public.users.id
      `, (err, res) => {
        if (err) throw err
        //console.log(res.rows)

        res.rows.forEach(row => {
          if (!(row.id in groupedData)) {
            groupedData[row.id] = {name: row.name, tasks: []};
          }
          groupedData[row.id].tasks.push({id: row.task_id, title: row.task_name, isComplete: row.is_complete})
          
        
        })
        response.send(groupedData);
      }
    )
});

/* PUT user task. */
router.put('/add', function(req, response, next) {

  var taskName = req.body.taskName;
  var userId = req.body.userId;

  dbQuery(
    `
    INSERT INTO public.tasks(id, task_name)
    VALUES (${userId}, '${taskName}')
    RETURNING task_id;
    `, (err, res) => {
      if (err || res.rows.length > 1) throw err

      response.status(200).send({taskId: res.rows[0].task_id})
  })
});

/* PUT user task. */
router.post('/remove', function(req, response, next) {

  var userId = req.body.userId;
  var taskId = req.body.taskId;

  getPool().query(
    `
    DELETE FROM public.tasks
    WHERE task_id=${taskId} AND id=${userId}
    `, (err, res) => {
      if (err) throw err

      response.send('task removed successfully');
    }
  )
});

/* POST user update task. */
router.post('/status', function(req, response, next) {
  const taskId = req.body.task_id;
  const userId = req.body.id;
  const status = !!req.body.new_status;
  
  getPool().query(
    `
    UPDATE public.tasks
    SET is_complete = ${status}
    WHERE task_id=${taskId} AND id=${userId};
    `, (err, res) => {
      if (err) {
        response.send('task update failed');
        throw err
      } else {
        response.send('task updated successfully');
      }
  })
});



router.get('/test', async function(req, response, next) {
  const queryString = `
  SELECT * FROM public.tasks
  LEFT JOIN public.users ON public.tasks.id=public.users.id`

    let groupedData = {};
    var result = await dbQuery(queryString)

    response.status(result.status).send(result.data)
});

module.exports = router;
