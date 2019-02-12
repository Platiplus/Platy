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
            footer: "Saldo Atualizado",
            spacing: 3
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
        footer: `Previsto: R$ ${results['income_prediction']}`,
        spacing: 3
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
        footer: `Previsto: R$ ${results['outcome_prediction']}`,
        spacing: 3
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
      footer: collection[0]['description'],
      spacing: 3
    };

      response.status(200).json({error: false, data: card});
  })
  .catch((error) => {
      response.status(500).json({error: true, data: error.message});
  });
};

//FIND INCOMES AND OUTCOMES (PREDICTED AND EXECUTED) FROM LAST 6 MONTHS
exports.fetch_flux6_MONTHS = (request, response, next) => {
    let begin = moment().subtract(5, 'months').startOf('day').startOf('month');
    let end = moment().endOf('day').endOf('month');

    Transaction.find({owner: request.body.owner, date: {$gte: begin, $lte: end}})
    .select('date type value status')
    .sort({date: 1})
    .exec()
    .then((collection) => {
        let monthCounter = 0;
        let results = {
            labels: [],
            incomes: [],
            outcomes: []
        };

        if(collection[0] === undefined){
            response.status(200).json({error: false, data: results});
        } else {
            results.labels.push(moment(collection[0]['date']).format('MMM'));
            results.incomes.push(0);
            results.outcomes.push(0);

            collection.forEach((element) => {
                if(moment(element['date']).format('MMM') === results.labels[monthCounter]){
                    if(element['type'] === 1){
                        results['outcomes'][monthCounter] += element['value'];
                    } else {
                            results['incomes'][monthCounter] += element['value'];
                        }
                } else {
                    results.incomes[monthCounter] = Number(results.incomes[monthCounter].toFixed(2));
                    results.outcomes[monthCounter] = Number(results.outcomes[monthCounter].toFixed(2));

                    results.labels.push(moment(element['date']).format('MMM'));
                    results.incomes.push(0);
                    results.outcomes.push(0);
                    monthCounter++;

                    if(element['type'] === 1){
                        results['outcomes'][monthCounter] += element['value'];
                    } else {
                            results['incomes'][monthCounter] += element['value'];
                        }       
                }
            });

        results.incomes[monthCounter] = Number(results.incomes[monthCounter].toFixed(2));
        results.outcomes[monthCounter] = Number(results.outcomes[monthCounter].toFixed(2));

        let chart_data = {
            labels: results.labels,
            datasets: [
            {
                label: "Recebimentos",
                fillColor: "rgba(39, 177, 45, 0.2)",
                strokeColor: "rgba(39, 177, 45, 1)",
                pointColor: "rgba(39, 177, 45, 1)",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(39, 177, 45, 1)",
                data: results.incomes
            },
            {
                label: "Despesas",
                fillColor: "rgba(248, 41, 34, 0.2)",
                strokeColor: "rgba(248, 41, 34, 1)",
                pointColor: "rgba(248, 41, 34, 1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(248, 41, 34, 1)",
                data: results.outcomes
            }
        ]};

        response.status(200).json({error: false, data: chart_data});
        }
    })
    .catch((error) => {
        response.status(500).json({error: true, data: error.message});
    });
};

//FIND INCOMES AND OUTCOMES (PREDICTED AND EXECUTED) FROM CURRENT MONTH
exports.fetch_compareLast_MONTH = (request, response, next) => {
    let begin = moment().subtract(1, 'months').startOf('day').startOf('month');
    let end = moment().endOf('day').endOf('month');

    Transaction.find({owner: request.body.owner, date: {$gte: begin, $lte: end}})
    .select('date type value status')
    .sort({date: 1})
    .exec()
    .then((collection) => {
        let monthCounter = 0;
        let results = {
            labels: [],
            incomes: [],
            outcomes: []
        };
        
        if(collection[0] === undefined){
            response.status(200).json({error: false, data: results});
        } else {
            results.labels.push(moment(collection[0]['date']).format('MMM'));
            results.incomes.push(0);
            results.outcomes.push(0);

            collection.forEach((element) => {
                if(moment(element['date']).format('MMM') === results.labels[monthCounter]){
                    if(element['type'] === 1){
                        results['outcomes'][monthCounter] += element['value'];
                    } else {
                            results['incomes'][monthCounter] += element['value'];
                        }
                } else {
                    results.incomes[monthCounter] = Number(results.incomes[monthCounter].toFixed(2));
                    results.outcomes[monthCounter] = Number(results.outcomes[monthCounter].toFixed(2));

                    results.labels.push(moment(element['date']).format('MMM'));
                    results.incomes.push(0);
                    results.outcomes.push(0);
                    monthCounter++;

                    if(element['type'] === 1){
                        results['outcomes'][monthCounter] += element['value'];
                    } else {
                            results['incomes'][monthCounter] += element['value'];
                        }       
                }
            });

        results.incomes[monthCounter] = Number(results.incomes[monthCounter].toFixed(2));
        results.outcomes[monthCounter] = Number(results.outcomes[monthCounter].toFixed(2));

        let chart_data = {
            labels: results.labels,
            datasets: [
            {
                label: "Recebimentos",
                fillColor: "rgba(39, 177, 45, 0.2)",
                strokeColor: "rgba(39, 177, 45, 1)",
                pointColor: "rgba(39, 177, 45, 1)",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(39, 177, 45, 1)",
                data: results.incomes
            },
            {
                label: "Despesas",
                fillColor: "rgba(248, 41, 34, 0.2)",
                strokeColor: "rgba(248, 41, 34, 1)",
                pointColor: "rgba(248, 41, 34, 1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(248, 41, 34, 1)",
                data: results.outcomes
            }
        ]};

        response.status(200).json({error: false, data: chart_data});
        }
    })
    .catch((error) => {
        response.status(500).json({error: true, data: error.message});
    });
};

//FETCH 4 LAST TRANSACTIONS
exports.fetch_dashboard_last_TRANSACTION = (request, response, next) => {
    let threshold = moment().endOf('month');
    Transaction.find({owner: request.body.owner, date:{$lte: threshold}, status: true})
    .sort({date: -1})
    .limit(4)
    .exec()
    .then((collection) => {
        let results = [];

        collection.forEach(element => {
            results.push({
                type: element['type'],
                date: moment(element['date']).format('YYYY-MM-DD'),
                description: element['description'],
                value: 'R$ ' + element['value'],
                category: element['category'],
                status: element['status']
            });
        });

        response.status(200).json({error: false, data: results});
    })
    .catch((error) => {
        response.status(500).json({error: true, data: error.message});
    });
};