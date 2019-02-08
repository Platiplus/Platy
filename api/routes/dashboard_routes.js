//DEPENDENCIES
const express = require('express');
const router = express.Router();

//CONTROLLER IMPORTING
const DashboardController = require('../controllers/dashboard_controller');

//FETCH CURRENT BALANCE
router.post('/balance', DashboardController.fetch_user_current_BALANCE);
//FETCH INCOME FROM CURRENT MONTH
router.post('/income', DashboardController.fetch_income_state_current_MONTH);
//FETCH OUTCOME FROM CURRENT MONTH
router.post('/outcome', DashboardController.fetch_outcome_state_current_MONTH);
//FETCH LAST TRANSACTION
router.post('/last_transaction', DashboardController.fetch_last_TRANSACTION);

//ROUTER EXPORTING
module.exports = router;