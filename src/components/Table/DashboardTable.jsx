import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const styles = theme => ({
  root: {
    width: '100%',
    marginBottom: theme.spacing.unit * 3,
  }
});

let id = 0;
function createData({type, date, description, value, category, status}) {
  id += 1;

  if(type === 1){
    type = (<i className="material-icons" style={{color: '#E8413D'}}>expand_more</i>);
  } else {
    type = (<i className="material-icons" style={{color: '#3C763D'}}>expand_less</i>);
  }

  if(status === true){
    status = (<span className="btn btn-success">Pago</span>);
  } else {
    status = (<span className="btn btn-warning">Pendente</span>);
  }
  
  return { id, type, date, description, value, category, status };
}

function SimpleTable(props) {
  const { classes, data } = props;

  const rows = [];
  
  data.map((row) => {
    rows.push(createData(row));
  });

  return (
      <div className="card card-chart transitioning">
        <div className="card-chart-header card-chart-header-info">
            <h4 className="card-chart-title">Últimas Transações</h4>
            <p className="card-chart-category">Despesas e Recebimentos</p>
        </div>
        <div className="card-body" style={{overflowX:'auto'}}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Tipo</TableCell>
                <TableCell align="right">Data</TableCell>
                <TableCell align="right">Descrição</TableCell>
                <TableCell align="right">Valor</TableCell>
                <TableCell align="right">Categoria</TableCell>
                <TableCell align="right">Pago</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {row.type}
                  </TableCell>
                  <TableCell align="right">{row.date}</TableCell>
                  <TableCell align="right">{row.description}</TableCell>
                  <TableCell align="right">{row.value}</TableCell>
                  <TableCell align="right">{row.category}</TableCell>
                  <TableCell align="right">{row.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>);
}

SimpleTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleTable);