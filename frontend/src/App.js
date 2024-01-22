import React, { useState, useRef } from 'react';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import logo from './logo.svg';
import './App.css';

const MySwal = withReactContent(Swal)

function App() {
  const [data, setData] = useState([]);
  const textareaRef = useRef(null);

  const selectTextarea = async () => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }
    textarea.select();
    // textarea.setSelectionRange(0, textarea.value.length);
    // // deprecated
    // document.execCommand('copy');
    // await navigator.clipboard.writeText(textarea.value);
  }

  const fetchData = async () => {
    // Swal.fire({
    //   title: 'Fetching...',
    //   allowOutsideClick: false,
    //   showConfirmButton: false,
    //   willOpen: () => {
    //     Swal.showLoading();
    //   }
    // });

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
      textareaRef.current.value = result
      // await navigator.clipboard.writeText(result);
      // await MySwal.fire({
      //   title: "Copied to the clipboard!",
      //   icon: "success"
      // });
      await selectTextarea();
      // await MySwal.fire({
      //   title: 'OK!',
      //   icon: 'success',
      //   timer: 2000,
      //   showConfirmButton: false
      // }); 
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
          {/* Fetch Feedly & Copy to Clipboard */}
          Fetch Feedly
        </a>
        <textarea
          ref={textareaRef}
          readOnly
          // style={{ position: 'absolute', left: '-9999px' }}
        />
      </header>
    </div>
  );
}

export default App;
