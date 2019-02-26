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

  // owner = '5b47c2c9f7e56d0a404245db';
  owner = '5c7048fefcf5cf00148a9016';

  state = {
    value: 'incomes',
    transactions: {
      incomes: [],
      fixed_outcomes: [],
      variant_outcomes: []
    },
    loading: true
  };

  componentWillMount(){
    this.fetchTransactions(this.props);
  }

  componentWillReceiveProps(next_props){
    if(this.props !== next_props){
      this.fetchTransactions(next_props);
    }
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  fetchTransactions(props){
    const {initial_date, end_date} = props;

    axios.post(process.env.REACT_APP_API + this.url, {owner: this.owner, initial_date: initial_date, end_date: end_date})
    .then((transactions_list) => {
      let transactions = Object.assign({}, this.state.transactions, {
        incomes: transactions_list['data']['data'].income,
        fixed_outcomes: transactions_list['data']['data'].outcome_fixed,
        variant_outcomes: transactions_list['data']['data'].outcome
      });
      this.setState({transactions, loading: false});
    });
  }

  render() {
    const { classes, initial_date } = this.props;
    const { value, transactions } = this.state;
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
          {!this.state.loading && value === 'incomes' && <TabContainer><TransactionsTable type={2} fixed={false} date={initial_date} data={transactions.incomes}/></TabContainer>}
          {!this.state.loading && value === 'fixed_outcomes' && <TabContainer><TransactionsTable type={1} fixed={true} date={initial_date} data={transactions.fixed_outcomes}/></TabContainer>}
          {!this.state.loading && value === 'variant_outcomes' && <TabContainer><TransactionsTable type={1} fixed={false} date={initial_date} data={transactions.variant_outcomes}/></TabContainer>}
        </div>
        </div>
      );
  }
}

ScrollableTabsButtonAuto.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ScrollableTabsButtonAuto);