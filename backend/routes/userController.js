var express = require('express');
var router = express.Router();
const { connectClient } = require('../db/dbConnection');



/* GET users tasks. DEPRECATED */
router.get('/', function(req, response, next) {

});

/* get all user task. */
router.get('/get-all', function(req, response, next) {

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