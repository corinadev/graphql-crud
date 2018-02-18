import { gql } from 'apollo-boost';

export const GET_EMPLOYEES = gql`
    query { 
        allEmployees { 
            id,
            firstName, 
            lastName
        } 
    }
`;

export const UPDATE_EMPLOYEE = gql`
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