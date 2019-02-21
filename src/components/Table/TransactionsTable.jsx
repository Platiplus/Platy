import React, { Component }  from 'react';
import Paper from '@material-ui/core/Paper';
import { EditingState } from '@devexpress/dx-react-grid';
import moment from 'moment';
import {
  Getter,
} from '@devexpress/dx-react-core';

import {
  Grid,
  Table,
  TableHeaderRow,
  TableEditRow,
  TableEditColumn,
} from '@devexpress/dx-react-grid-material-ui';

const getRowId = row => row._id;

export default class TransactionsTable extends Component {

  constructor(props) {
    super(props);
    this.commitChanges = this.commitChanges.bind(this);
  }

  state = {
    data: this.props.data,
    columns: [
      { name: 'date', title: 'Data' },
      { name: 'description', title: 'Descrição' },
      { name: 'value', title: 'Valor' },
      { name: 'category', title: 'Categoria' },
      { name: 'target', title: 'Pago à' },
      { name: 'status', title: 'Status' },
    ]
  };

  createData({_id, date, description, value, category, target, status}) { 
  
    date = moment(date).format('DD/MM/YYYY');
  
    if(status === true){
      status = 'PAGO';
    } else {
      status = 'PENDENTE';
    }
  
    return { _id, date, description, value, category, target, status };
  }

  commitChanges({ added, changed, deleted }) {
    let { data } = this.state;
    
    if (added) {
      let new_row = added[0];
      new_row['_id'] = '16978561'; 
      data.push(this.createData(new_row));
    }
    if (changed) {
      data = data.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));
    }
    if (deleted) {
      const deletedSet = new Set(deleted);
      data = data.filter(row => !deletedSet.has(row.id));
    }
    this.setState({ data });
  }

  render() {
    let { columns, data } = this.state;
    
    let rows = [];
    
    data.map((row) => {
      rows.push(this.createData(row));
    });
    
    return (
      <Paper className={'transitioning'}>
        <Grid
          rows={rows}
          columns={columns}
          getRowId={getRowId}
        >
          <EditingState
            onCommitChanges={this.commitChanges}
          />
          <Table />
          <TableHeaderRow />
          <TableEditRow />
          <TableEditColumn
            showAddCommand
            showEditCommand
            showDeleteCommand
          />
          <Getter
          name="tableColumns"
          computed={({ tableColumns }) => {
            debugger
            const result = [
              ...tableColumns.filter(c => c.type !== TableEditColumn.COLUMN_TYPE),
              { key: 'editCommand', type: TableEditColumn.COLUMN_TYPE, width: 140 }
            ];
            return result;
          }
          }
        />
        </Grid>
      </Paper>
    );
  }
}