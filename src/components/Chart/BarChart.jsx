import React, {Component} from 'react';
import './Chart.scss';

export default class BarChart extends Component{
  
  render(){
    let {header, description, chart} = this.props.info;
    var Chart = require("react-chartjs").Bar;
    
    let chart_options = {
      responsive: true,
      scaleLabel: function(label){return  'R$ ' + label.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");}
    };

    return(
    <div className="col-lg-6 col-md-12">
      <div className="card card-chart transitioning">
        <div className="card-chart-header card-chart-header-info">
            <h4 className="card-chart-title">{header}</h4>
            <p className="card-chart-category">{description}</p>
        </div>
        <div className="card-body">
        <Chart data={chart} options={chart_options} width="600" height="250"/>
        </div>
      </div>
    </div>);
  }
}