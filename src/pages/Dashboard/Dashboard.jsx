import React, {Component} from "react";
import Card from 'components/Card/Card';
import LineChart from 'components/Chart/LineChart';
import BarChart from 'components/Chart/BarChart';
import DashboardTable from 'components/Table/DashboardTable';
import axios from 'axios';
import './Dashboard.scss';

export default class Dashboard extends Component{

  cards_urls = [
    'dashboard/balance',
    'dashboard/income',
    'dashboard/outcome',
    'dashboard/last_transaction',
  ];

  flux_chart_url = 'dashboard/flux6';
  compare_chart_url = 'dashboard/compare';
  last_transactions_url = 'dashboard/last_4'; 
  
  // owner = '5b47c2c9f7e56d0a404245db';
  owner = '5c7048fefcf5cf00148a9016';

  state = {
    cards : [],
    flux: [],
    compare: [],
    last_transactions: []
  };

  componentDidMount(){
    this.loadStatsCards(this);
    this.loadChartCards(this);
    this.loadTransactionCard(this);
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
           this.state.flux
         }
        {
          this.state.compare
          }
        </div>
        <div className="row">
          <div className="col-12">
          {
            this.state.last_transactions
          }
          </div>
        </div>
      </div>);
  };

  loadStatsCards(){
    let card_calls = [];
    
    this.cards_urls.map((url) => {
      card_calls.push(axios.post(process.env.REACT_APP_API + url, {owner: this.owner}));  
    });

    Promise.all(card_calls).then((cards) => {
      let new_cards = [];
      cards.forEach((card) => {
        new_cards.push(card['data']['data']);
      })
      this.setState({cards: new_cards});
    });
  };
  
  loadChartCards(){
    axios.post(process.env.REACT_APP_API + this.flux_chart_url, {owner: this.owner}).then((chart_data) => {
      let flux = <LineChart info={{header: 'Fluxo de Caixa', description: 'Últimos 6 meses', chart: chart_data['data']['data']}}/>
      this.setState({flux});
    });

    axios.post(process.env.REACT_APP_API + this.compare_chart_url, {owner: this.owner}).then((chart_data) => {
      let compare = <BarChart info={{header: 'Comparativo mês a mês', description: 'Mês passado e atual', chart: chart_data['data']['data']}}/>
      this.setState({compare});
    });
  };

  loadTransactionCard(){
    axios.post(process.env.REACT_APP_API + this.last_transactions_url, {owner: this.owner}).then((last__made_transactions) => {
      let last_transactions = <DashboardTable data={last__made_transactions['data']['data']}/>
      this.setState({last_transactions});
    });
  };
}