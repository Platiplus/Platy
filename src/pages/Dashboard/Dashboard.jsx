import React, {Component} from "react";
import './Dashboard.scss';
import Card from '../../components/Card/Card';

export default class Dashboard extends Component{
  //ESSES DADOS ABAIXO VÃO VIR DE UMA CHAMADA NA API
  current_balance = {
    header: 'Saldo Atual',
    icon: 'account_balance_wallet',
    balance: 1954.32,
    footer: 'Saldo Atualizado'
  };

  income = {
    header: 'Recebimentos',
    icon: 'add_circle',
    balance: 2542.06,
    footer: 'Previsto: R$ 2.664,81'
  };

  outcome = {
    header: 'Despesas',
    icon: 'remove_circle',
    balance: 621.94,
    footer: 'Previsto: R$ 2.499,54'
  };

  last_transaction = {
    header: 'Última transação',
    icon: 'attach_money',
    balance: 462.24,
    footer: 'Cartão de Crédito'
  };

  render(){
    return (
    <div className="col-12">
      <div className="row">
        <Card info={this.current_balance}/>
        <Card info={this.income}/>
        <Card info={this.outcome}/>
        <Card info={this.last_transaction}/>
      </div>
    </div>);
  };
}