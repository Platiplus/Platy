import React, {Component} from 'react';
import './Card.scss';

export default class Card extends Component{

  render(){
    let {header, balance, icon, footer} = this.props.info;

    return(
    <div className="col-lg-3 col-md-6 col-sm-6">
      <div className="card card-stats">
        <div className="card-header card-header-info card-header-icon">
          <div className="card-icon">
            <i className="material-icons">{icon}</i>
          </div>
          <p className="card-category">{header}</p>
          <h3 className="card-title"><small>R$ </small>{balance}</h3>
        </div>
        <div className="card-footer">
          <div className="stats">
            <i></i> {footer}
          </div>
        </div>
      </div>
    </div>);
  }
}