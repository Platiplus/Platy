//DEPENDENCIES
const express = require('express');
const router = express.Router();

//CONTROLLER IMPORTING
const TransactionsController = require('../controllers/transactions_controller');

//FETCH CURRENT BALANCE
router.post('/profit', TransactionsController.fetch_PROFIT);

//FETCH CURRENT BALANCE
router.post('/incomes', TransactionsController.fetch_income_state_specific_MONTH);

//FETCH CURRENT BALANCE
router.post('/outcomes', TransactionsController.fetch_outcome_state_specific_MONTH);

//FETCH MONTH TRANSACTIONS
router.post('/month_transactions', TransactionsController.fetch_month_TRANSACTIONS);

//ADD TRANSACTION
router.post('/add', TransactionsController.add_TRANSACTION);

//UPDATE TRANSACTION
router.post('/update', TransactionsController.update_TRANSACTION);

//DELETE TRANSACTION
router.post('/delete', TransactionsController.delete_TRANSACTION);

module.exports = router;