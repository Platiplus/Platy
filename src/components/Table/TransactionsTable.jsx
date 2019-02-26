import React, { Component }  from 'react';
import Paper from '@material-ui/core/Paper';
import { Getter } from '@devexpress/dx-react-core';

import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import TableCell from '@material-ui/core/TableCell';
import MenuItem from '@material-ui/core/MenuItem';

import { 
  EditingState,
  PagingState,
  IntegratedPaging 
} from '@devexpress/dx-react-grid';

import {
  Grid,
  Table,
  TableHeaderRow,
  TableEditRow,
  TableEditColumn,
  PagingPanel
} from '@devexpress/dx-react-grid-material-ui';


import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon   from '@material-ui/icons/Edit';
import SaveIcon   from '@material-ui/icons/Save';
import AddIcon    from '@material-ui/icons/Add';

import moment from 'moment';
import axios from 'axios';

export default class TransactionsTable extends Component {

  constructor(props) {
    super(props);
    this.commitChanges = this.commitChanges.bind(this);
  }

  state = {
    data: this.props.data,
    currentPage: 0,
    pageSize: 5,
    pageSizes: [5, 10, 0],
    columns: [
      { name: 'date', title: 'Data' },
      { name: 'description', title: 'Descrição' },
      { name: 'value', title: 'Valor' },
      { name: 'category', title: 'Categoria' },
      { name: 'target', title: 'Pago à' },
      { name: 'status', title: 'Status' },
    ]
  };

  componentWillReceiveProps(next_props){
    if(this.props !== next_props){
      this.setState({data: next_props.data, date: next_props.date});
    }
  }

  createData({_id, date, description, value, category, target, status}) { 
    date = moment(date).format('DD/MM/YYYY');
    status === true ? status = 'PAGO' : status = 'PENDENTE';
    return { _id, date, description, value, category, target, status };
  }

  changeCurrentPage = currentPage => this.setState({ currentPage });
  changePageSize = pageSize => this.setState({ pageSize });

  commitChanges({ added, changed, deleted }) {
    let { date } = this.props;
    let { data } = this.state;
    
    if (added) {
      let new_date = added[0]['date'].split(/d{0,}\//g);

      let new_row = added[0];

      new_row['date'] = new_date.reverse().join('-');
      new_row['owner'] = '5c7048fefcf5cf00148a9016';
      new_row['type'] = this.props.type;
      new_row['fixed'] = this.props.fixed;
      new_row['status'] = new_row['status'] || true;

      axios.post(process.env.REACT_APP_API + 'transactions/add', new_row).then((transaction_id) => {
        new_row['_id'] = transaction_id['data']['data']['_id'];
        
        if(date.format('YYYY-MMM') === moment(new_row['date']).format('YYYY-MMM')){
          data.push(new_row);
          this.setState({ data });
        }
      });
    }

    if (changed) {
      let transaction_id = Object.keys(changed)[0];
      let transaction = changed[transaction_id];

      if(transaction['date']){
        let new_date = transaction['date'].split(/d{0,}\//g);
        transaction['date'] = moment(new_date.reverse().join('-'));
      }

      let body = {
        transaction_id,
        transaction
      };

      axios.post(process.env.REACT_APP_API + 'transactions/update', body).then((result) => {
        if(date.format('YYYY-MMM') === moment(transaction['date']).format('YYYY-MMM')){
          data = data.map(row => (changed[row._id] ? { ...row, ...changed[row._id] } : row));
        } else {
          let moved = '';
          data.find((transaction) => {
            console.log(transaction);
            if(transaction._id === transaction_id){
              moved = data.indexOf(transaction);
            }
          });
          data.splice(moved, 1);
        }
        this.setState({ data });
      });
    }

    if (deleted) {
      let body = {
        transaction_id: deleted[0]
      };

      axios.post(process.env.REACT_APP_API + 'transactions/delete', body).then((result) => {
        data.find((transaction) => {
          if(transaction._id === deleted[0]){
            deleted = data.indexOf(transaction);
          }
        });
        data.splice(deleted, 1);

        this.setState({ data });
      });      
    }

  }

  render() {
    let { columns, data, currentPage, pageSize, pageSizes } = this.state;
    
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
          <PagingState
            currentPage={currentPage}
            onCurrentPageChange={this.changeCurrentPage}
            pageSize={pageSize}
            onPageSizeChange={this.changePageSize}
          />
          <IntegratedPaging />
          <PagingPanel
            pageSizes={pageSizes}
          />
          <Table />
          <TableHeaderRow />
          <TableEditRow
            cellComponent={EditCell}
          />
          <TableEditColumn
            width={170}
            showAddCommand
            showEditCommand
            showDeleteCommand
            commandComponent={Command}
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

const availableValues = {
  status: [
    {
      title: 'PAGO',
      value: true
    },
    {
      title: 'PENDENTE',
      value: false
    }
  ]
};

const getRowId = row => row._id;

const AddButton = ({ onExecute }) => (
  <div style={{ textAlign: 'center' }}>
    <IconButton onClick={onExecute} title="Create new row">
      <AddIcon />
    </IconButton>
  </div>
);

const EditButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Edit row">
    <EditIcon />
  </IconButton>
);

const DeleteButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Delete row">
    <DeleteIcon />
  </IconButton>
);

const CommitButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Save changes">
    <SaveIcon />
  </IconButton>
);

const CancelButton = ({ onExecute }) => (
  <IconButton color="secondary" onClick={onExecute} title="Cancel changes">
    <CancelIcon />
  </IconButton>
);

const commandComponents = {
  add: AddButton,
  edit: EditButton,
  delete: DeleteButton,
  commit: CommitButton,
  cancel: CancelButton,
};

const Command = ({ id, onExecute }) => {
  const CommandButton = commandComponents[id];
  return (
    <CommandButton onExecute={onExecute}/>
  );
};

const EditCell = (props) => {
  const { column } = props;
  const availableColumnValues = availableValues[column.name];
  if (availableColumnValues) {
    return <LookupEditCell {...props} availableColumnValues={availableColumnValues} />;
  }
  return <TableEditRow.Cell {...props} />;
};

export const LookupEditCell = ({availableColumnValues, value, onValueChange}) => {
  if(value === undefined){
    value = true;
  } else if(value === 'PAGO') {
    value = true;
  }
  else if (value === 'PENDENTE'){
    value = false;
  }
  
  return(
  <TableCell>
    <Select
      value={value}
      onChange={event => onValueChange(event.target.value)}
      input={(<Input/>)}>
      {availableColumnValues.map(item => (
        <MenuItem key={item.title} value={item.value}>
          {item.title}
        </MenuItem>
        ))
      }
    </Select>
  </TableCell>
  )
};