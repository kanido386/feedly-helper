import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const plainText = 'Hello, world!'
      console.log(process.env.REACT_APP_API_ENDPOINT)
      const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/encrypt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plainText
        })
      });
      const { encrypted } = await response.json();
      console.log(`Encrypt ${plainText} to ${encrypted}`);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="#"
          rel="noopener noreferrer"
          onClick={fetchData}
        >
          Fetch Data
        </a>
      </header>
    </div>
  );
}

export default App;
