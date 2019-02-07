import React, {Component} from 'react';
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Dashboard from '../../pages/Dashboard/Dashboard';
import Transactions from '../../pages/Transactions/Transactions';
import './Menu.scss';

export default class Menu extends Component{
  render(){
    return(
      <Router>
      <Route render={({ location, history }) => (
          <React.Fragment>
              <SideNav onSelect={(selected) => {
                  const to = '/' + selected;
                  if (location.pathname !== to) {
                      history.push(to);
                    }
                }}>
                  <SideNav.Toggle />
                  <SideNav.Nav defaultSelected="dashboard">
                      <NavItem eventKey="dashboard">
                          <NavIcon>
                              <i className="fa fa-fw fa-line-chart" style={{ fontSize: '1.75em' }} />
                          </NavIcon>
                          <NavText>
                              Dashboard
                          </NavText>
                      </NavItem>
                      <NavItem eventKey="transactions">
                          <NavIcon>
                              <i className="fa fa-fw fa-money" style={{ fontSize: '1.75em' }} />
                          </NavIcon>
                          <NavText>
                              Transactions
                          </NavText>
                      </NavItem>
                  </SideNav.Nav>
              </SideNav>
              <main>
                <Route path="/" exact component={Dashboard}/>
                <Route path="/dashboard" component={Dashboard}/>
                <Route path="/transactions" component={Transactions}/>
                {/* <Route path="/" exact component={props => <RootComponent />} />
                <Route path="/home" component={props => <Home />} />
                <Route path="/devices" component={props => <Devices />} /> */}
              </main>
          </React.Fragment>
      )}
      />
    </Router>
    );
  }
}