var express = require('express');
//const client = require('pg/lib/native/client');
var router = express.Router();
const { Client } = require('pg')

let client = null;

setTimeout( () => {
  client = new Client({
    host: 'host.docker.internal',
    port: 5432,
    user: 'postgres',
    password: 'postgrespw',
  })

  client.connect((err) => {
    if (err) {
      console.log('connection error', err.stack)
    } else {
      console.log('connected')
    }
  })
}, 5000)


/* GET users tasks. */
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

    //console.log(groupedData)
    //response.send(res.rows)

    //res.send('respond with a resource');
});

/* PUT user task. */
router.put('/', function(req, response, next) {

    var groupedData;
    client.query(`SELECT * FROM public.tasks`, (err, res) => {
        if (err) throw err
        //console.log(res.rows)

        res.rows.forEach(task => {
            groupedData[task.name].append({title: task.task_name, isComplete: task.is_complete})
        })

        //console.log(groupedData)

        //response.send(res.rows)

    })
    res.send('respond with a resource');
});

module.exports = router;
