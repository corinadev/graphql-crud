import React from 'react';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';
import { Column, Table } from 'react-virtualized';

const GET_EMPLOYEES = gql`
    query { 
        allEmployees { 
            id,
            firstName, 
            lastName
        } 
    }
`;

const EmployeeList = () => (
    <div>
        <Query query={GET_EMPLOYEES}>
            {({ loading, error, data }) => {
                if (loading) return <div>Loading...</div>;
                if (error) return <div>Error :(</div>;
       
                return (
                    <Table
                        width={800}
                        height={300}
                        headerHeight={20}
                        rowHeight={30}
                        rowCount={data.allEmployees.length}
                        rowGetter={({ index }) => data.allEmployees[index]}
                    >
                        <Column
                            label='First'
                            dataKey='firstName'
                            width={100}
                        />
                        <Column
                            width={200}
                            label='Last name'
                            dataKey='lastName'
                        />
                    </Table>
                );
            }}
        </Query>
    </div>
)

export default EmployeeList;