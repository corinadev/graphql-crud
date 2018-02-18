/**
 * Example from:
 * https://devexpress.github.io/devextreme-reactive/react/grid/demos/featured/controlled-mode/
 */
import React from 'react';
import { graphql, compose } from 'react-apollo';
import {
  SortingState, EditingState, PagingState,
  IntegratedPaging, IntegratedSorting,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table, TableHeaderRow, TableEditRow, TableEditColumn,
  PagingPanel, DragDropProvider, TableColumnReordering,
} from '@devexpress/dx-react-grid-material-ui';
import Paper from 'material-ui/Paper';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Input from 'material-ui/Input';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import { TableCell } from 'material-ui/Table';

import DeleteIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/Edit';
import SaveIcon from 'material-ui-icons/Save';
import CancelIcon from 'material-ui-icons/Cancel';
import { withStyles } from 'material-ui/styles';
import { 
    GET_PRODUCTS, 
    UPDATE_PRODUCT, 
    DELETE_PRODUCT, 
    CREATE_PRODUCT 
} from '../../graphql/products';
import {
    ProgressBarCell,
  } from './../ProductsGrid/ProgressBarCell';
  import {
    HighlightedCell,
  } from './../ProductsGrid/HighlightedCell';
import { create } from 'jss';

const styles = theme => ({
  lookupEditCell: {
    paddingTop: theme.spacing.unit * 0.875,
    paddingRight: theme.spacing.unit,
    paddingLeft: theme.spacing.unit,
  },
  dialog: {
    width: 'calc(100% - 16px)',
  },
  inputRoot: {
    width: '100%',
  },
});

const AddButton = ({ onExecute }) => (
  <div style={{ textAlign: 'center' }}>
    <Button
      color="primary"
      onClick={onExecute}
      title="Create new row"
    >
      New
    </Button>
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
    <CommandButton
      onExecute={onExecute}
    />
  );
};

const availableValues = {
  product: ['SolarMax', 'SolarOne', 'EnviroCare', 'EnviroCare Max'],
  region:  ['Asia', 'Europe', 'North America', 'South America', 'Australia', 'Africa'],
  customer:  [
    'Renewable Supplies', 'Energy Systems', 'Environment Solar', 'Beacon Systems', 'Apollo Inc',
    'Gemini Stores', 'McCord Builders', 'Building M Inc', 'Global Services',
    'Market Eco', 'Johnson & Assoc', 'Get Solar Inc', 'Supply Warehouse', 'Discovery Systems', 'Mercury Solar'],
};

const LookupEditCellBase = ({
  availableColumnValues, value, onValueChange, classes,
}) => (
  <TableCell
    className={classes.lookupEditCell}
  >
    <Select
      value={value}
      onChange={event => onValueChange(event.target.value)}
      input={
        <Input
          classes={{ root: classes.inputRoot }}
        />
      }
    >
      {availableColumnValues.map(item => (
        <MenuItem key={item} value={item}>{item}</MenuItem>
      ))}
    </Select>
  </TableCell>
);
export const LookupEditCell = withStyles(styles, { name: 'ControlledModeDemo' })(LookupEditCellBase);

const Cell = (props) => {
  if (props.column.name === 'discount') {
    return <ProgressBarCell {...props} />;
  }
  if (props.column.name === 'amount') {
    return <HighlightedCell {...props} />;
  }
  return <Table.Cell {...props} />;
};

const EditCell = (props) => {
  const availableColumnValues = availableValues[props.column.name];
  if (availableColumnValues) {
    return <LookupEditCell {...props} availableColumnValues={availableColumnValues} />;
  }
  return <TableEditRow.Cell {...props} />;
};

const getRowId = row => row.id;

class EditableProductsGrid extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'product', title: 'Product' },
        { name: 'region', title: 'Region' },
        { name: 'amount', title: 'Sale Amount' },
        { name: 'discount', title: 'Discount' },
        { name: 'saleDate', title: 'Sale Date' },
        { name: 'customer', title: 'Customer' },
      ],
      tableColumnExtensions: [
        { columnName: 'amount', align: 'right' },
      ],
      sorting: [],
      editingRowIds: [],
      addedRows: [],
      rowChanges: {},
      currentPage: 0,
      deletingRows: [],
      pageSize: 0,
      pageSizes: [5, 10, 0],
      columnOrder: ['product', 'region', 'amount', 'discount', 'saleDate', 'customer'],
    };

    this.changeSorting = sorting => this.setState({ sorting });
    this.changeEditingRowIds = editingRowIds => this.setState({ editingRowIds });
    this.changeAddedRows = addedRows => this.setState({
      addedRows: addedRows.map(row => (Object.keys(row).length ? row : {
        amount: 0,
        discount: 0,
        saleDate: new Date().toISOString().split('T')[0],
        product: availableValues.product[0],
        region: availableValues.region[0],
        customer: availableValues.customer[0],
      })),
    });
    this.changeRowChanges = rowChanges => this.setState({ rowChanges });
    this.changeCurrentPage = currentPage => this.setState({ currentPage });
    this.changePageSize = pageSize => this.setState({ pageSize });
    this.commitChanges = ({ added, changed, deleted }) => {
        console.log(added, changed, deleted);

        if(changed) {
            for (const [id, updatedRow] of Object.entries(changed)) {
                this.props.updateProduct({
                    variables: { 
                        id,
                        ...updatedRow
                    },
                    update: (store, { data: { updateProduct } }) => {
                        const data = store.readQuery({ query: GET_PRODUCTS })
                        data.allProducts[updateProduct.id] = updateProduct;
                        store.writeQuery({
                            query: GET_PRODUCTS,
                            data,
                        })
                    },
                })
            }
        }

        if(added) {
            for (const addedRow of added) {
                this.props.createProduct({
                    variables: { 
                        ...addedRow
                    },
                    update: (store, { data: { createProduct } }) => {
                        const data = store.readQuery({ query: GET_PRODUCTS })
                        data.allProducts.push(createProduct);
                        store.writeQuery({
                            query: GET_PRODUCTS,
                            data,
                        })
                    },
                })
            }
        }

        if(deleted) {
            for (const deletedId of deleted) {
                this.props.deleteProduct({
                    variables: { 
                        id: deletedId
                    },
                    update: (store, { data: { deleteProduct } }) => {
                        const data = store.readQuery({ query: GET_PRODUCTS });
                        const index = data.allProducts.findIndex((p) => p.id === deleteProduct.id);
                        delete data.allProducts.splice(index, 1);
                        store.writeQuery({
                            query: GET_PRODUCTS,
                            data,
                        })
                    },
                })
            }
        }
    };
    this.cancelDelete = () => this.setState({ deletingRows: [] });
    this.deleteRows = () => {
      const rows = this.state.rows.slice();
      this.state.deletingRows.forEach((rowId) => {
        const index = rows.findIndex(row => row.id === rowId);
        if (index > -1) {
          rows.splice(index, 1);
        }
      });
      this.setState({ rows, deletingRows: [] });
    };
    this.changeColumnOrder = (order) => {
      this.setState({ columnOrder: order });
    };
  }
  render() {
    const {
      classes,
      data,
    } = this.props;
    if (data.loading) return <div>Loading...</div>;
    if (data.error) return <div>Error :(</div>

    const rows = data.allProducts;

    const {
      columns,
      tableColumnExtensions,
      sorting,
      editingRowIds,
      addedRows,
      rowChanges,
      currentPage,
      deletingRows,
      pageSize,
      pageSizes,
      columnOrder,
    } = this.state;

    return (
      <Paper>
        <Grid
          rows={rows}
          columns={columns}
          getRowId={getRowId}
        >
          <SortingState
            sorting={sorting}
            onSortingChange={this.changeSorting}
          />
          <PagingState
            currentPage={currentPage}
            onCurrentPageChange={this.changeCurrentPage}
            pageSize={pageSize}
            onPageSizeChange={this.changePageSize}
          />

          <IntegratedSorting />
          <IntegratedPaging />

          <EditingState
            editingRowIds={editingRowIds}
            onEditingRowIdsChange={this.changeEditingRowIds}
            rowChanges={rowChanges}
            onRowChangesChange={this.changeRowChanges}
            addedRows={addedRows}
            onAddedRowsChange={this.changeAddedRows}
            onCommitChanges={this.commitChanges}
          />

          <DragDropProvider />

          <Table
            columnExtensions={tableColumnExtensions}
            cellComponent={Cell}
          />

          <TableColumnReordering
            order={columnOrder}
            onOrderChange={this.changeColumnOrder}
          />

          <TableHeaderRow showSortingControls />
          <TableEditRow
            cellComponent={EditCell}
          />
          <TableEditColumn
            width={120}
            showAddCommand={!addedRows.length}
            showEditCommand
            showDeleteCommand
            commandComponent={Command}
          />
          <PagingPanel
            pageSizes={pageSizes}
          />
        </Grid>

        <Dialog
          open={!!deletingRows.length}
          onClose={this.cancelDelete}
          classes={{ paper: classes.dialog }}
        >
          <DialogTitle>Delete Row</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure to delete the following row?
            </DialogContentText>
            <Paper>
              <Grid
                rows={rows.filter(row => deletingRows.indexOf(row.id) > -1)}
                columns={columns}
              >
                <Table
                  columnExtensions={tableColumnExtensions}
                  cellComponent={Cell}
                />
                <TableHeaderRow />
              </Grid>
            </Paper>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.cancelDelete} color="primary">Cancel</Button>
            <Button onClick={this.deleteRows} color="secondary">Delete</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    );
  }
}

export default compose(
    graphql(GET_PRODUCTS, { name: 'data' }),
    graphql(UPDATE_PRODUCT, { name: 'updateProduct' }),
    graphql(DELETE_PRODUCT, { name: 'deleteProduct' }),
    graphql(CREATE_PRODUCT, { name: 'createProduct' }),
    withStyles(styles, { name: 'ControlledModeDemo' })
  )(EditableProductsGrid);