import React from 'react';
import { DogToy, useGetToysUnderPriceQuery } from './schema';

import './App.css';

// Utilize the environment variables defined in the `.env` file
const {
  REACT_APP_CONTENTFUL_SPACE_ID: SPACE_ID,
  REACT_APP_CONTENTFUL_ENVIRONMENT: ENVIRONMENT,
  REACT_APP_CONTENTFUL_API_KEY: API_KEY,
} = process.env;

const CONTENTFUL_GRAPHQL_ENDPOINT = `https://graphql.contentful.com/content/v1/spaces/${SPACE_ID}/environments/${ENVIRONMENT}`;

const App = () => {
  const { loading, error, data } = useGetToysUnderPriceQuery({
    variables: {
      maxPrice: 20
    }
  });

  // Use optional chaining to retrieve the nested items array OR default to an empty array
  const allToys = (data?.dogToyCollection?.items || []) as DogToy[];

  if (error) {
    console.error(error);
    return <div className="app"><h1>Oops! Something went wrong</h1></div>
  } else if (loading) {
    return <div className="app">
      <div className="loader"/>
    </div>;
  }

  return (
    <div className="app">
      <div className="container">
        <h1>Welcome! These are Cowboy's toys</h1>
        <ul className="productList">
          {allToys.map((toy) =>
            <li key={toy.sys.id} id={toy.sys.id} className="productCard">
              <h2>
                <span>{toy.toyName}</span>
                <span>${toy.estimatedPrice}</span>
              </h2>
              {toy.toyPhoto?.url && <img src={toy.toyPhoto.url} alt=""/>}
            </li>,
          )}
        </ul>
      </div>
      <footer>
        <div className="container">
          The GraphQL Schema for the above data can be explored within <a
          href={`${CONTENTFUL_GRAPHQL_ENDPOINT}/explore?access_token=${API_KEY}`}>GraphiQL</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
