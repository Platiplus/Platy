import React, {Component} from 'react';
import Card from 'components/Card/Card';
import Tabs from 'components/Tab/Tab';
import moment from 'moment';
import axios from 'axios';
import MonthPickerInput from 'react-month-picker-input';
import './Transactions.scss';

export default class Transactions extends Component{
  constructor(props) {
    super(props)
    this.handler = this.handler.bind(this);
  }

  cards_urls = [
    'transactions/profit',
    'transactions/incomes',
    'transactions/outcomes',
  ];
  
  // owner = '5b47c2c9f7e56d0a404245db';
  owner = '5c7048fefcf5cf00148a9016';

  state = {
    cards : [],
    initial_date: moment().startOf('month'),
    end_date: moment().endOf('month'),
    update_cards: false
  };

  componentDidMount(){
    this.loadStatsCards(this.state);
  }

  handler() {
    this.setState({
      update_cards: !this.state.update_cards
    });
  }

  componentWillUpdate(next_props, next_state){
    if(this.state.initial_date !== next_state.initial_date || this.state.update_cards !== next_state.update_cards){
      this.loadStatsCards(next_state);
      }
  }
  
  render(){
    const {initial_date, end_date, cards} = this.state;
    return (
      <div className="col-12">
        <div className="row">
          {
            cards.map(card => <Card key={card.id} info={card}/>)
          }
        </div>
        <div className="row">
          <div className="col-12">
            <div className={'month-picker'}>
            <MonthPickerInput 
              year={new Date().getFullYear()}
              month={new Date().getMonth()}
              onChange={(maskedValue, selectedYear, selectedMonth) => {
                let original_date = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
                let initial_date = moment(original_date).startOf('month');
                let end_date = moment(original_date).endOf('month');
                this.setState({initial_date, end_date});
              }}
            />
            </div>
          </div>
        </div>
        <div className="row">
          <Tabs update={this.handler} initial_date={initial_date} end_date={end_date}/>
        </div>
      </div>
    );
  };

  loadStatsCards(state){
    const { initial_date, end_date } = state;

    let card_calls = [];
    
    this.cards_urls.map((url) => {
      card_calls.push(axios.post(process.env.REACT_APP_API + url, {owner: this.owner, initial_date: initial_date, end_date: end_date}));  
    });

    Promise.all(card_calls).then((cards) => {
      let new_cards = [];
      cards.forEach((card) => {
        new_cards.push(card['data']['data']);
      });
      this.setState({cards: new_cards});
    });
  };
}