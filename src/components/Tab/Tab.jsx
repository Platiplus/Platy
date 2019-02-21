import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TransactionsTable from 'components/Table/TransactionsTable';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';

function TabContainer(props) {
  return (
    <Typography component="div">
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});

class ScrollableTabsButtonAuto extends React.Component {

  url = 'transactions/month_transactions';

  owner = '5b47c2c9f7e56d0a404245db';

  state = {
    value: 'incomes',
    transactions: {
      incomes: [],
      fixed_outcomes: [],
      variant_outcomes: []
    }
  };

  componentDidMount(){
    this.fetchTransactions(this);
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value, transactions } = this.state;

    if(transactions.incomes[0] !== undefined){
      return (
        <div className='col-12'>
        <div className={classes.root}>
          <AppBar position="static">
            <Tabs value={value} onChange={this.handleChange}>
              <Tab value="incomes" label="Recebimentos" />
              <Tab value="fixed_outcomes" label="Despesas Fixas" />
              <Tab value="variant_outcomes" label="Despesas Variáveis" />
            </Tabs>
          </AppBar>
          {value === 'incomes' && <TabContainer><TransactionsTable data={transactions.incomes}/></TabContainer>}
          {value === 'fixed_outcomes' && <TabContainer><TransactionsTable data={transactions.fixed_outcomes}/></TabContainer>}
          {value === 'variant_outcomes' && <TabContainer><TransactionsTable data={transactions.variant_outcomes}/></TabContainer>}
        </div>
        </div>
      );
    } else {
      return null;
    }
  }

  fetchTransactions(context){
    axios.post(process.env.REACT_APP_API + context.url, {owner: context.owner, initial_date: context.props.dates.initial_date, end_date: context.props.dates.end_date})
    .then((transactions) => {
      context.state.transactions.incomes = transactions['data']['data'].income;
      context.state.transactions.fixed_outcomes = transactions['data']['data'].outcome_fixed;
      context.state.transactions.variant_outcomes = transactions['data']['data'].outcome;
      context.setState(context.state.transactions);
    });
  }

}

ScrollableTabsButtonAuto.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ScrollableTabsButtonAuto);