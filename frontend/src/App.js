import React, { useState } from 'react';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import logo from './logo.svg';
import './App.css';

const MySwal = withReactContent(Swal)

function App() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    Swal.fire({
      title: 'Fetching...',
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      console.log(process.env.REACT_APP_API_ENDPOINT)
      const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/feedly`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const { result } = await response.json();
      // console.dir(result, { depth: null });
      await navigator.clipboard.writeText(result);
      await MySwal.fire({
        title: "Copied to the clipboard!",
        icon: "success"
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      alert(JSON.stringify(error))
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
          Fetch Feedly & Copy to Clipboard
        </a>
      </header>
    </div>
  );
}

export default App;
