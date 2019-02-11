import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    width: '100%',
    marginBottom: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

let id = 0;
function createData({type, date, description, value, category, status}) {
  id += 1;
  return { id, type, date, description, value, category, status };
}

const rows = [];

function SimpleTable(props) {
  const { classes, data } = props;
  
  data.map((row) => {
    rows.push(createData(row));
  });

  return (
      <div className="card card-chart transitioning">
        <div className="card-chart-header card-chart-header-info">
            <h4 className="card-chart-title">Últimas Transações</h4>
            <p className="card-chart-category">Despesas e Recebimentos</p>
        </div>
        <div className="card-body">
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
                  <TableCell align="right">{row.status.toString()}</TableCell>
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