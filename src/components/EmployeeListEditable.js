import React from 'react';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';
import { graphql, compose } from 'react-apollo';
import ReactDataGrid from 'react-data-grid';
import { from } from 'zen-observable';

const GET_EMPLOYEES = gql`
    query { 
        allEmployees { 
            id,
            firstName, 
            lastName
        } 
    }
`;

const UPDATE_EMPLOYEE = gql`
    mutation (
        $id:ID!, 
        $firstName: String, 
        $lastName: String
    ) {
        updateEmployee(
            id: $id, 
            firstName: $firstName,
            lastName: $lastName
        ) {
            id,
            firstName,
            lastName
        }
    }
`;

const columns = [
    {
        key: 'id',
        name: 'ID',
        width: 80
    },
    {
        key: 'firstName',
        name: 'First name',
        editable: true
    },
    {
        key: 'lastName',
        name: 'Last name',
        editable: true
    }
]

class EmployeeList extends React.Component {
    handleGridRowsUpdated = ({ rowIds, updated }) => {
        console.log('ROWS UPDATED', rowIds, updated);
        this.props.updateEmployee({
            variables: { 
                id: rowIds[0],
                ...updated
            },
            update: (store, { data: { updateEmployee } }) => {
                const data = store.readQuery({ query: GET_EMPLOYEES })
                data.allEmployees[updateEmployee.id] = updateEmployee;
                store.writeQuery({
                  query: GET_EMPLOYEES,
                  data,
                })
              },
          })
      };

    render() {
        return <div>
            <Query query={GET_EMPLOYEES}>
                {({ loading, error, data }) => {
                    if (loading) return <div>Loading...</div>;
                    if (error) return <div>Error :(</div>;
        
                    return (
                        <ReactDataGrid
                            enableCellSelect={true}
                            columns={columns}
                            rowGetter={(index) => (data.allEmployees[index])}
                            rowsCount={data.allEmployees.length}
                            minHeight={500}
                            onGridRowsUpdated={this.handleGridRowsUpdated} />
                    );
                }}
            </Query>
        </div>
    }
}

export default compose(
    graphql(UPDATE_EMPLOYEE, { name: 'updateEmployee' })
)(EmployeeList);