import React, {Component} from 'react';
import './Card.scss';

export default class Card extends Component{

  render(){
    let {header, balance, icon, footer, spacing} = this.props.info;
    //The color for all Cards is temporarily green cuz i'm getting annoyed by all the color switching
    let color = 'success';
    return(
    <div className={`col-lg-${spacing} col-md-6 col-sm-6`}>
      <div className="card card-stats transitioning">
        <div className={`card-header card-header-${color} card-header-icon`}>
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