//DEPENDENCIES
const express = require('express');
const router = express.Router();

//CONTROLLER IMPORTING
const usersController = require('../controllers/users_controller');

//ROUTES DECLARATION

//CREATE A NEW USER ON THE DATABASE
router.post('/add', usersController.create_USER);

//USER LOGIN
router.post('/login', usersController.login_USER);

//DELETE AN USER FROM THE DATABASE
router.delete('/:userID', usersController.delete_USER);

//UPDATE AN USER FROM THE DATABASE
router.patch('/:userID', usersController.update_USER);

module.exports = router;