import React, { useState, useEffect } from 'react';

import Header from './components/Header/Header';
import NewProduct from './components/Products/NewProduct';
import ProductList from './components/Products/ProductList';
import './App.css';

function App() {
  const [loadedProducts, setLoadedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      // set isLoading state to true to indicate app is gathering data
      setIsLoading(true);

      // set await response to endpoint server using the app.get API in Node.js
      const response = await fetch('http://localhost:9000/products');

      // once the backend responds back with the data, a const is set with the data as a JSON
      const responseData = await response.json();

      // useEffect detects the change, then sets the React states accordingly
      // responseData.products => DUMMY_PRODUCTS
      setLoadedProducts(responseData.products);
      // set isLoading to false because we now have the data to render
      setIsLoading(false);
    };

    fetchProducts(); // useEffect then triggers the React state to update
  }, []);

  const addProductHandler = async (productName, productPrice) => {
    try { // attempt the post command
      const newProduct = { // set the schema of the newProduct using the entry points
        title: productName,
        price: +productPrice // "+" to convert string to number
      };
      let hasError = false;
      const response = await fetch('http://localhost:9000/product', { // fetches product method using process
        method: 'POST',
        body: JSON.stringify(newProduct),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) { // did the response work?
        hasError = true;
      }

      const responseData = await response.json(); // get the JSON back with the new value

      if (hasError) {
        throw new Error(responseData.message);
      }

      setLoadedProducts(prevProducts => { // used to rerender the front-end using the useState
        return prevProducts.concat({
          ...newProduct,
          id: responseData.product.id
        });
      });
    } catch (error) {
      alert(error.message || 'Something went wrong!');
    }
  };

  return (
    <React.Fragment>
      <Header />
      <main>
        <NewProduct onAddProduct={addProductHandler} />
        {isLoading 
          ? <p className="loader">Loading...</p>
          : <ProductList items={loadedProducts} /> }
      </main>
    </React.Fragment>
  );
}

export default App;
