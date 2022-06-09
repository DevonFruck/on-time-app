var express = require('express');
//const client = require('pg/lib/native/client');
var router = express.Router();
const { Client } = require('pg')

let client = null;
let hostAddress = process.env.npm_config_host;

setTimeout( async () => {
  client = new Client({
    user: 'postgres',
    host: hostAddress,
    database: 'postgres',
    password: "iamtheadmin12345",
    port: "5432",
  })

  await client.connect((err) => {
    if (err) {
      console.log('connection error', err.stack)
    } else {
      console.log('connected')
    }
  })

  await client.query(
    `
      CREATE TABLE IF NOT EXISTS public.tasks
      (
          id numeric NOT NULL,
          task_id numeric NOT NULL,
          task_name text COLLATE pg_catalog."default" NOT NULL,
          is_complete boolean DEFAULT false,
          CONSTRAINT tasks_pkey PRIMARY KEY (task_id)
      );
      
      CREATE TABLE IF NOT EXISTS public.users
      (
          id numeric NOT NULL,
          name text COLLATE pg_catalog."default" NOT NULL,
          CONSTRAINT users_pkey PRIMARY KEY (id)
      );
    `
  );
}, 2000)


/* GET users tasks. DEPRECATED */
router.get('/', function(req, response, next) {

  let groupedData = {};
  client.query('SELECT * FROM public.tasks', (err, res) => {
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
router.get('/get-all', function(req, response, next) {

    let groupedData = {};
    client.query(
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
    })
    
});

/* PUT user task. */
router.put('/add', function(req, response, next) {

  var taskName = req.body.taskName;
  var userId = req.body.userId;

  client.query(
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

  client.query(
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
  console.log('ayoo')
  var taskId = req.body.task_id;
  var userId = req.body.id;
  var status = !!req.body.new_status;
  
  console.log('wahoo')
  console.log(taskId)
  console.log(userId)
  console.log(status)
  client.query(
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

module.exports = router;
