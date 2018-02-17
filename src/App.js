import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

// here we create a query opearation
const MY_QUERY = gql`query { allEmployees { firstName, lastName } }`;

class App extends Component {
  render() {
    console.log(this.props);
    return (      
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>      
    );
  }
}

export default graphql(MY_QUERY)(App);
