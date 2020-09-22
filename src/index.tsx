import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

// Utilize the environment variables defined in the `.env` file
const {
  REACT_APP_CONTENTFUL_SPACE_ID: SPACE_ID,
  REACT_APP_CONTENTFUL_ENVIRONMENT: ENVIRONMENT,
  REACT_APP_CONTENTFUL_API_KEY: API_KEY,
} = process.env;

export const apolloClient = new ApolloClient({
  uri: `https://graphql.contentful.com/content/v1/spaces/${SPACE_ID}/environments/${ENVIRONMENT}`,
  headers: {
    Authorization: `Bearer ${API_KEY}`,
  },
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <App/>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
