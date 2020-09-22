import React from 'react';
import { API_KEY, CONTENTFUL_GRAPHQL_ENDPOINT } from 'apolloClient';
import { DogToy, useGetToysUnderPriceQuery } from 'schema';

import './App.css';

const App = () => {
  const [maxPrice, setMaxPrice] = React.useState<number>(200);
  const { loading, error, data } = useGetToysUnderPriceQuery({
    variables: { maxPrice: maxPrice || Number.POSITIVE_INFINITY }
  });

  // Use optional chaining to retrieve the nested items array OR default to an empty array
  const allToys = (data?.dogToyCollection?.items || []) as DogToy[];

  if (error) {
    console.error(error);
    return <div className="app"><h1>Oops! Something went wrong</h1></div>
  }

  return (
    <div className="app">
      <div className="container">
        <h1>Welcome! These are Cowboy's toys</h1>
        <label className="priceFilter">
          <span>Filter toys by price</span>
          <div className="dollarInputWrapper">
            <span className="dollarSign">$</span>
            <input value={maxPrice} type="number" min="0" max="1000" step="1" onChange={(e) => setMaxPrice(Number(e.target.value))} />
          </div>
        </label>
        {
          loading ? <div className="loader"/> : (<ul className="productList">
            {allToys.map((toy) =>
              <li key={toy.sys.id} id={toy.sys.id} className="productCard">
                <h2>
                  <span>{toy.toyName}</span>
                  <span>${toy.estimatedPrice}</span>
                </h2>
                {toy.toyPhoto?.url && <img src={toy.toyPhoto.url} alt=""/>}
              </li>,
            )}
          </ul>)
        }
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
