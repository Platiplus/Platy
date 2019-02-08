import React, {Component} from 'react';
import './Chart.scss';

export default class Chart extends Component{

  render(){
    // let {header, balance, icon, footer} = this.props.info;

    return(
    <div className="col-lg-6 col-md-12">
      <div className="card card-chart transitioning">
        <div className="card-chart-header card-chart-header-info">
            <h4 className="card-chart-title">Fluxo de Caixa</h4>
            <p className="card-chart-category">Últimos 6 meses</p>
        </div>
        <div className="card-body"></div>
      </div>
    </div>);
  }
}