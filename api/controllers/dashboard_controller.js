//DEPENDENCIES
const moment = require('moment');

//MODEL IMPORTING
const Transaction = require('../models/transaction_model');
const User = require('../models/user_model');

//METHODS DECLARATION

//FIND ALL TRANSACTIONS FROM SPECIFIC USER
exports.fetch_user_current_BALANCE = (request, response, next) => {
  User.find({_id: request.body.owner})
      .select('initialBalance')
      .exec()
      .then((balance) => {
          let currentBalance = balance[0]['initialBalance'];
  Transaction.find({owner: request.body.owner})
      .select('type value status')
      .exec()
      .then((collection) => {
          collection.forEach((element) => {
              if(element['type'] === 1){
                  switch(element['status']){
                      case true:
                      currentBalance -= element['value'];
                      break;
                  }
              } else {
                  switch(element['status']){
                      case true:
                      currentBalance += element['value'];
                      break;
              }
          }
      });
          currentBalance = Number(currentBalance.toFixed('2'));

          let card = {
            id: 1,
            header: "Saldo Atual",
            icon: "account_balance_wallet",
            balance: currentBalance,
            footer: "Saldo Atualizado"
          };

          response.status(200).json({error: false, data: card});
      })
  })
  .catch((error) => {
      response.status(500).json({error: true, data: error.message});
  });
};

//FIND INCOMES (PREDICTED AND EXECUTED) FROM CURRENT MONTH
exports.fetch_income_state_current_MONTH = (request, response, next) => {
  let begin = moment().startOf('day').startOf('month');
  let end = moment().endOf('day').endOf('month');

  Transaction.find({owner: request.body.owner, date: {$gte: begin, $lte: end}, type: 2})
  .select('type value status')
  .exec()
  .then((collection) => {
      let results = {
          income_executed: 0,
          income_prediction: 0
      };
      
      collection.forEach((element) => {
        if(element['status']){
          results['income_executed'] += element['value'];
        }
          results['income_prediction'] += element['value'];
        });

      results['income_executed'] =  Number(results['income_executed'].toFixed(2));
      results['income_prediction'] = Number(results['income_prediction'].toFixed(2));
    
      let card = {
        id: 2,
        header: "Recebimentos",
        icon: "add_circle",
        balance: results['income_executed'],
        footer: `Previsto: R$ ${results['income_prediction']}`
      };

      response.status(200).json({error: false, data: card});
  })
  .catch((error) => {
      response.status(500).json({error: true, data: error.message});
  });
};

//FIND OUTCOMES (PREDICTED AND EXECUTED) FROM CURRENT MONTH
exports.fetch_outcome_state_current_MONTH = (request, response, next) => {
  let begin = moment().startOf('day').startOf('month');
  let end = moment().endOf('day').endOf('month');

  Transaction.find({owner: request.body.owner, date: {$gte: begin, $lte: end}, type: 1})
  .select('type value status')
  .exec()
  .then((collection) => {
      let results = {
          outcome_executed: 0,
          outcome_prediction: 0
      };
      
      collection.forEach((element) => {
        if(element['status']){
          results['outcome_executed'] += element['value'];
        }
          results['outcome_prediction'] += element['value'];
        });

      results['outcome_executed'] =  Number(results['outcome_executed'].toFixed(2));
      results['outcome_prediction'] = Number(results['outcome_prediction'].toFixed(2));
    
      let card = {
        id: 3,
        header: "Despesas",
        icon: "remove_circle",
        balance: results['outcome_executed'],
        footer: `Previsto: R$ ${results['outcome_prediction']}`
      };

      response.status(200).json({error: false, data: card});
  })
  .catch((error) => {
      response.status(500).json({error: true, data: error.message});
  });
};

//FETCH LAST TRANSACTION
exports.fetch_last_TRANSACTION = (request, response, next) => {
  let threshold = moment().endOf('month');
  Transaction.find({owner: request.body.owner, date:{$lte: threshold}, status: true})
  .sort({date: -1})
  .limit(1)
  .exec()
  .then((collection) => {

    let card = {
      id: 4,
      header: "Última transação",
      icon: "attach_money",
      balance: collection[0]['value'],
      footer: collection[0]['description']
    };

      response.status(200).json({error: false, data: card});
  })
  .catch((error) => {
      response.status(500).json({error: true, data: error.message});
  });
};