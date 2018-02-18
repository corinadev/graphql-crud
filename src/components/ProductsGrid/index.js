/**
 * Example from:
 * https://devexpress.github.io/devextreme-reactive/react/grid/demos/featured/uncontrolled-mode/
 */
import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import { gql } from 'apollo-boost';
import { graphql, compose } from 'react-apollo';
import {
  SortingState, SelectionState, FilteringState, PagingState, GroupingState,
  IntegratedFiltering, IntegratedGrouping, IntegratedPaging, IntegratedSorting, IntegratedSelection,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table, TableHeaderRow, TableFilterRow, TableSelection, TableGroupRow,
  PagingPanel, GroupingPanel, DragDropProvider, TableColumnReordering, Toolbar,
  TableColumnVisibility, ColumnChooser,
} from '@devexpress/dx-react-grid-material-ui';

import {
  ProgressBarCell,
} from './ProgressBarCell';
import {
  HighlightedCell,
} from './HighlightedCell';

import { GET_PRODUCTS, UPDATE_PRODUCT } from '../../graphql/products';

const Cell = (props) => {
  if (props.column.name === 'discount') {
    return <ProgressBarCell {...props} />;
  }
  if (props.column.name === 'amount') {
    return <HighlightedCell {...props} />;
  }
  return <Table.Cell {...props} />;
};

class ProductsGrid extends React.PureComponent {
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
      pageSizes: [5, 10, 15],
    };
  }
  render() {
    const {
      columns, tableColumnExtensions, pageSizes,
    } = this.state;
    const { data } = this.props;
    if (data.loading) return <div>Loading...</div>;
    if (data.error) return <div>Error :(</div>

    return (
      <Paper>
        <Grid
          rows={data.allProducts}
          columns={columns}
        >
          <FilteringState
            defaultFilters={[{ columnName: 'saleDate', value: '2018-02' }]}
          />
          <SortingState
            defaultSorting={[
              { columnName: 'product', direction: 'asc' },
              { columnName: 'saleDate', direction: 'asc' },
            ]}
          />

          <SelectionState />

          <PagingState
            defaultCurrentPage={0}
            defaultPageSize={10}
          />

          <IntegratedFiltering />
          <IntegratedSorting />
          <IntegratedPaging />
          <IntegratedSelection />

          <DragDropProvider />

          <Table
            columnExtensions={tableColumnExtensions}
            cellComponent={Cell}
          />
          <TableSelection showSelectAll />

          <TableColumnReordering defaultOrder={columns.map(column => column.name)} />

          <TableHeaderRow showSortingControls />
          <TableFilterRow />
          <PagingPanel
            pageSizes={pageSizes}
          />

          <TableColumnVisibility
            defaultHiddenColumnNames={['customer']}
          />
          <Toolbar />
          <ColumnChooser />
        </Grid>
      </Paper>
    );
  }
}

ProductsGrid.propTypes = {
  data: PropTypes.object
}

export default compose(
  graphql(GET_PRODUCTS, { name: 'data' }),
  graphql(UPDATE_PRODUCT, { name: 'updateProduct' })
)(ProductsGrid);