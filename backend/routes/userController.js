var express = require('express');
var router = express.Router();
const dbQuery = require('../db/dbConnection');
const dbError = 'Unexpected database error';


/* GET users tasks. DEPRECATED */
router.post('/authenticate', async function(req, response, next) {
    const username = req.body.username;

    const queryString = `
    SELECT * FROM public.users WHERE username='${username}'
    `

    await dbQuery(queryString)
    .then(res => {
        if(res.rowCount === 0) {
            response.status(404).send("Could not find user")
        } else {
            response.status(200).send({ userId: res.rows[0].user_id })
        }
    })
    .catch((err) => { 
        console.error(err);
        response.status(500).send(dbError);
    })

});

/* get all user task. */
router.put('/create', async function(req, response, next) {
    const username = req.body.username;
    const displayName = req.body.displayName;

    const queryString = `
    INSERT INTO public.users (username, display_name)
    VALUES('${username}', '${displayName}')
    ON CONFLICT (username) DO NOTHING

    RETURNING user_id;
    `

    await dbQuery(queryString)
    .then(res => { 
        if(res.rowCount === 0) {
            response.status(400).send("username is already registered")
        } else {
            response.status(200).send({ userId: res.rows[0].user_id })
        }
    })
    .catch((err) => { 
        console.error(err);
        response.status(500).send(dbError);
    })
});

/* PUT user task. */
router.put('/add', function(req, response, next) {

});

/* PUT user task. */
router.post('/remove', function(req, response, next) {

});

/* POST user update task. */
router.post('/status', function(req, response, next) {

});

module.exports = router;