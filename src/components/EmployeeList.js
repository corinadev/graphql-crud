import React from 'react';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';

const GET_EMPLOYEES = gql`
    query { 
        allEmployees { 
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

                const rows = data.allEmployees.map((employee) => {
                    return <tr>
                        <td>{employee.firstName}</td>
                        <td>{employee.lastName}</td>
                    </tr>
                });
        
                return (
                    <table>
                        {rows}
                    </table>
                );
            }}
        </Query>
    </div>
)

export default EmployeeList;
// export default () => (<div></div>);