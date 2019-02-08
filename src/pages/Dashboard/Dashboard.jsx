import React, {Component} from "react";
import './Dashboard.scss';
import Card from 'components/Card/Card';
import Chart from 'components/Chart/Chart';
import axios from 'axios';

export default class Dashboard extends Component{

  cards_urls = [
    'dashboard/balance',
    'dashboard/income',
    'dashboard/outcome',
    'dashboard/last_transaction',
  ];

  owner = '5b47c2c9f7e56d0a404245db';

  state = {
    cards : []
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
          {
           this.state.cards.map(card => <Chart key={(Math.random() * 100).toFixed(2)}/>) 
          }
        </div>
      </div>);
  };

  loadStatsCards(context){
    let card_calls = [];
    
    context.cards_urls.map((url) => {
      card_calls.push(axios.post(process.env.REACT_APP_API + url, {owner: context.owner}));  
    });

    Promise.all(card_calls).then((cards) => {
      cards.forEach((card) => {
        context.state.cards.push(card['data']['data']);
      })
      context.setState(context.state.cards);
    });
  }
}