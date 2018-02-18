import { gql } from 'apollo-boost';

const allMeetingFields = gql`
    fragment AllMeetingFields on Meeting {
        id,
        title,
        start: startDate,
        end: endDate,
        description
    }
`;

export const GET_MEETINGS = gql`
    query { 
        allMeetings { 
            ...AllMeetingFields
        } 
    }
    ${allMeetingFields}
`;

export const CREATE_MEETING = gql`
     mutation (
        $title: String!, 
        $startDate: DateTime!,
        $endDate: DateTime!,
        $description: String
    ) {
        createMeeting(
            title: $title, 
            startDate: $startDate,
            endDate: $endDate,
            description: $description
        ) {
            ...AllMeetingFields
        }
    }
    ${allMeetingFields}
`;

export const DELETE_MEETING = gql`
    mutation (
        $id: ID!,
    ) {
        deleteMeeting(
            id: $id          
        ) {
            id
        }
    }
`;

export const UPDATE_MEETING = gql`
    mutation (
        $id: ID!,
        $title: String!, 
        $startDate: DateTime!,
        $endDate: DateTime!,
        $description: String
    ) {
        updateProduct (
            id: $id,
            title: $title, 
            startDate: $startDate,
            endDate: $endDate,
            description: $description
        ) {
            ...AllMeetingFields
        }
    }
    ${allMeetingFields}
`;