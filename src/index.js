import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import {
    BrowserRouter as Router,
    Route,
    Link
  } from 'react-router-dom'

import './index.css';
import 'react-virtualized/styles.css'; // only needs to be imported once

import EmployeeListEditable from './components/playground/EmployeeListEditable';
import ProductsGrid from './components/ProductsGrid/index';
import EditableProductsGrid from './components/EditableProductsGrid/index';
import HomePage from './pages/HomePage/index';
import ResponsiveDrawer from './components/Layout/ResponsiveDrawer';
import registerServiceWorker from './registerServiceWorker';

const client = new ApolloClient({
    link: new HttpLink({ 
      uri: 'https://api.graph.cool/simple/v1/cjdr4mt2y04th01925p7nyhxq' 
    }),
    cache: new InMemoryCache()
  });  

ReactDOM.render(
    <ApolloProvider client={client}>
         <Router>
            <ResponsiveDrawer>
                <Route exact path="/" component={HomePage}/>
                <Route path="/employees" component={EmployeeListEditable}/>
                <Route path="/products" component={ProductsGrid}/>
                <Route path="/products-editable" component={EditableProductsGrid}/>
                <Route path="/agenda" component={HomePage}/>
            </ResponsiveDrawer>
        </Router>
    </ApolloProvider>
, document.getElementById('root'));
registerServiceWorker();
