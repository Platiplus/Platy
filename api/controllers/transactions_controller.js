//DEPENDENCIES
const moment = require('moment');
const mongoose = require('mongoose');

//MODEL IMPORTING
const Transaction = require('../models/transaction_model');

//FIND INCOMES (PREDICTED AND EXECUTED) FROM SPECIFIC MONTH
exports.fetch_income_state_specific_MONTH = (request, response, next) => {
  let begin = request.body.initial_date;
  let end = request.body.end_date;

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
        footer: `Previsto: R$ ${results['income_prediction']}`,
        spacing: 4
      };

      response.status(200).json({error: false, data: card});
  })
  .catch((error) => {
      response.status(500).json({error: true, data: error.message});
  });
};

//FIND OUTCOMES (PREDICTED AND EXECUTED) FROM SPECIFIC MONTH
exports.fetch_outcome_state_specific_MONTH = (request, response, next) => {
  let begin = request.body.initial_date;
  let end = request.body.end_date;

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
        footer: `Previsto: R$ ${results['outcome_prediction']}`,
        spacing: 4
      };

      response.status(200).json({error: false, data: card});
  })
  .catch((error) => {
      response.status(500).json({error: true, data: error.message});
  });
};

//FETCH PROFIT BALANCE CURRENT MONTH
exports.fetch_PROFIT = (request, response, next) => {
  let begin = request.body.initial_date;
  let end = request.body.end_date;

  Transaction.find({owner: request.body.owner, date: {$gte: begin, $lte: end}})
  .select('type value status')
  .exec()
  .then((collection) => {
      let results = {
          income_prediction: 0,
          outcome_prediction: 0
      };
      
      collection.forEach((element) => {
          if(element['type'] === 1){
                  results['outcome_prediction'] += element['value'];
              } else {
                      results['income_prediction'] += element['value'];
                  }
              });

      let data = Number((results['income_prediction'] - results['outcome_prediction']).toFixed(2));

      let card = {
        id: 1,
        header: "Balanço do mês",
        icon: "attach_money",
        balance: data,
        footer: 'Balanço Atualizado',
        spacing: 4
      };

      response.status(200).json({error: false, data: card});
  })
  .catch((error) => {
      response.status(500).json({error: true, data: error.message});
  });
};

//FETCH TABLE OF INCOMES FROM SPECIFIC MONTH
exports.fetch_month_TRANSACTIONS = (request, response, next) => {
    let begin = request.body.initial_date;
    let end = request.body.end_date;
    
    Transaction.find({owner: request.body.owner, date: {$gte: begin, $lte: end}})
    .exec()
    .then((collection) => {
        let transactions = {
            income: [],
            outcome: [],
            outcome_fixed: []
        };
        
        collection.forEach(element => {
            switch(element['type']){
                case 1:
                if(element['fixed'] === true){
                    transactions['outcome_fixed'].push(element);
                } else {
                    transactions['outcome'].push(element);
                }
                break;
                default:
                transactions['income'].push(element);
                break;
            }
        });

        response.status(200).json({error: false, data: transactions});
    })
    .catch((error) => {
        response.status(500).json({error: true, data: error.message});
    });
};

//ADD A TRANSACTION INTO THE DATABASE
exports.add_TRANSACTION = (request, response, next) => {
  const transaction = new Transaction({
      _id: mongoose.Types.ObjectId(),
      type:           request.body.type,
      date:           moment(request.body.date),
      description :   request.body.description,
      target:         request.body.target,
      value:          request.body.value,
      category:       request.body.category,
      status:         request.body.status,
      owner: mongoose.Types.ObjectId(request.body.owner),
      fixed: request.body.fixed
  });
  transaction.save()
  .then((result) => {
      response.status(201).json({error: false, data: result});
  })
  .catch((error) => {
    console.log(error);
      response.status(500).json({error: true, data: error.message});
  });
};

//UPDATE A TRANSACTION INTO THE DATABASE
exports.update_TRANSACTION = (request, response, next) => {
  Transaction.update({_id: request.body.transaction_id}, {$set: request.body.transaction})
  .exec()
  .then((result) => {
      response.status(200).json({error: false, data: 'Transaction update succesfully', result: result});
  })
  .catch((error) => {
      response.status(500).json({error: false, data: error.message});
  });
};

//DELETE A TRANSACTION FROM THE BANK
exports.delete_TRANSACTION = (request, response, next) => {
  Transaction.findOneAndRemove({_id: request.body.transaction_id})
  .exec()
  .then((result) => {
      response.status(200).json({error: false, data: 'Transaction removed successfully', result: result});
  })
  .catch((error) => {
      response.status(500).json({error: true, data: error.message});
  });
};