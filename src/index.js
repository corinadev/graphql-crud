import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import './index.css';
import App from './App';
import EmployeeList from './components/EmployeeList';
import registerServiceWorker from './registerServiceWorker';

const client = new ApolloClient({
    link: new HttpLink({ 
      uri: 'https://api.graph.cool/simple/v1/cjdr4mt2y04th01925p7nyhxq' 
    }),
    cache: new InMemoryCache()
  });  

ReactDOM.render(
    <ApolloProvider client={client}>
        <EmployeeList />
    </ApolloProvider>
, document.getElementById('root'));
registerServiceWorker();
