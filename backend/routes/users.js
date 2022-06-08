var express = require('express');
//const client = require('pg/lib/native/client');
var router = express.Router();
const { Client } = require('pg')

let client = null;
let hostAddress = process.env.npm_config_host;

setTimeout( () => {
  client = new Client({
    user: 'postgres',
    host: hostAddress,
    database: 'postgres',
    password: "iamtheadmin12345",
    port: "5432",
  })

  client.connect((err) => {
    if (err) {
      console.log('connection error', err.stack)
    } else {
      console.log('connected')
    }
  })
}, 2000)


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
    })
    res.send('respond with a resource');
});

module.exports = router;
