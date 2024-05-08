import logo from './logo.svg';
import './App.css';
import React from 'react';
import MapComponent from './MapComponent';

function App() {
  return (
      <div className="App">
        <header className="App-header">
          <p>
            Click on the map to rate locations.
          </p>
        </header>
        <MapComponent />
      </div>
  );
}

export default App;
