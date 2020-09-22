import React, { useEffect } from 'react';
import './App.css';

// Utilize the environment variables defined in the `.env` file
const {
  REACT_APP_CONTENTFUL_SPACE_ID: SPACE_ID,
  REACT_APP_CONTENTFUL_ENVIRONMENT: ENVIRONMENT,
  REACT_APP_CONTENTFUL_API_KEY: API_KEY,
} = process.env;

const CONTENTFUL_GRAPHQL_ENDPOINT = `https://graphql.contentful.com/content/v1/spaces/${SPACE_ID}/environments/${ENVIRONMENT}`;

const GET_TOYS_QUERY = `
  query {
    dogToyCollection {
      items {
        sys { id },
        toyName,
        estimatedPrice,
        toyPhoto { url },
      }
    }
  }
`

const App = () => {
  const [{ data, loading, error }, setDogToyState] = React.useState({
    data: undefined,
    loading: true,
    error: undefined,
  });

  // Use optional chaining to retrieve the nested items array OR default to an empty array
  const allToys = data?.dogToyCollection?.items || [];

  // Fetch all dog toys from Contentful on page load
  useEffect(() => {
    // Set the loading flag to true and clear loading and error flags
    setDogToyState({ data: undefined, loading: true, error: undefined });

    // Fetch the data from Contentful
    fetch(
      CONTENTFUL_GRAPHQL_ENDPOINT,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: GET_TOYS_QUERY }),
      },
    )
      .then((res) => res.json())
      .then(({ data }) => {
        console.log('Received response from Contentful', data);
        setDogToyState({ data, loading: false, error: undefined })
      })
      .catch((err) => setDogToyState({ data: undefined, loading: false, error: err }))
  }, []);

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
              <img src={toy.toyPhoto.url} alt=""/>
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
