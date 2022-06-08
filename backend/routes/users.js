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

        res.rows.forEach(task => {
          if (!(task.id in groupedData)) {
            groupedData[task.id] = {name: task.name, tasks: []};
          }
          groupedData[task.id].tasks.push({title: task.task_name, isComplete: task.is_complete})
          
        
        })
        response.send(groupedData);
    })
    
});

/* PUT user task. */
router.put('/add-task', function(req, response, next) {
  console.log('request body: ');

  let taskName = req.body.task_name;
  let id = req.body.id;

  client.query(
    `
    INSERT INTO public.tasks(id, task_name)
    VALUES (${id}, '${taskName}')
    `, (err, res) => {
      if (err) throw err

      response.send('Added task successfully');
  })
});

module.exports = router;
