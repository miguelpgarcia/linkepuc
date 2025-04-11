import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Ensure the path is correct
import './styles.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') // Ensure this matches the 'root' div in your HTML
);
