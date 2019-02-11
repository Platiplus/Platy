import React, {Component} from "react";
import Card from 'components/Card/Card';
import LineChart from 'components/Chart/LineChart';
import BarChart from 'components/Chart/BarChart';
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
  
  owner = '5b47c2c9f7e56d0a404245db';

  state = {
    cards : [],
    flux: {},
    compare: {}
  };

  componentDidMount(){
    this.loadStatsCards(this);
    this.loadChartCards(this);
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
           this.flux
         }
        {
          this.compare
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
  
  loadChartCards(context){
    axios.post(process.env.REACT_APP_API + context.flux_chart_url, {owner: context.owner}).then((chart_data) => {
      context.flux = <LineChart info={{header: 'Fluxo de Caixa', description: 'Últimos 6 meses', chart: chart_data['data']['data']}}/>
      context.setState(this.state.flux);
    });

    axios.post(process.env.REACT_APP_API + context.compare_chart_url, {owner: context.owner}).then((chart_data) => {
      console.log(chart_data);
      context.compare = <BarChart info={{header: 'Comparativo mês a mês', description: 'Mês passado e atual', chart: chart_data['data']['data']}}/>
      context.setState(this.state.compare);
    });
  }
}