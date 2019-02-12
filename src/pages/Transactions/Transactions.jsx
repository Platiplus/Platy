import React, {Component} from 'react';
import Card from 'components/Card/Card';
import Tabs from 'components/Tab/Tab';
import moment from 'moment';
import axios from 'axios';
import './Transactions.scss';

export default class Transactions extends Component{

  cards_urls = [
    'transactions/profit',
    'transactions/incomes',
    'transactions/outcomes',
  ];
  
  owner = '5b47c2c9f7e56d0a404245db';

  state = {
    cards : [],
    dates: {initial_date: moment().startOf('month'), end_date: moment().endOf('month')}
  };

  componentDidMount(){
    this.loadStatsCards(this);
  }
  
  render(){
    return (
      <div className="col-12">
        <div className="row">
          {
            this.state.cards.map(card => <Card key={card.id} info={card}/>)
          }
        </div>
        <div className="row">
          <Tabs dates={this.state.dates}/>
        </div>
      </div>
    );
  };

  loadStatsCards(context){
    let card_calls = [];
    
    context.cards_urls.map((url) => {
      card_calls.push(axios.post(process.env.REACT_APP_API + url, {owner: context.owner, initial_date: context.state.dates.initial_date, end_date: context.state.dates.end_date}));  
    });

    Promise.all(card_calls).then((cards) => {
      cards.forEach((card) => {
        context.state.cards.push(card['data']['data']);
      })
      context.setState(context.state.cards);
    });
  };
}