import { gql } from 'apollo-boost';

const allProductFields = gql`
    fragment AllProductFields on Product {
        id,
        product, 
        region,
        amount,
        discount,
        saleDate,
        customer
    }
`;

export const GET_PRODUCTS = gql`
    query { 
        allProducts { 
            ...AllProductFields
        } 
    }
    ${allProductFields}
`;

export const CREATE_PRODUCT = gql`
     mutation (
        $product: String!, 
        $region: String!,
        $amount: Int,
        $discount: Float,
        $saleDate: DateTime,
        $customer: String
    ) {
        createProduct(
            product: $product, 
            region: $region,
            amount: $amount,
            discount: $discount,
            saleDate: $saleDate,
            customer: $customer
        ) {
            ...AllProductFields
        }
    }
    ${allProductFields}
`;

export const DELETE_PRODUCT = gql`
    mutation (
        $id: ID!,
    ) {
        deleteProduct(
            id: $id          
        ) {
            id
        }
    }
`;

export const UPDATE_PRODUCT = gql`
    mutation (
        $id: ID!,
        $product: String, 
        $region: String,
        $amount: Int,
        $discount: Float,
        $saleDate: DateTime,
        $customer: String
    ) {
        updateProduct (
            id: $id,
            product: $product, 
            region: $region,
            amount: $amount,
            discount: $discount,
            saleDate: $saleDate,
            customer: $customer
        ) {
            ...AllProductFields
        }
    }
    ${allProductFields}
`;