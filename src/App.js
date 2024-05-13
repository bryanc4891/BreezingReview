import React from 'react';
import './App.css';
import MapComponent from './MapComponent';
import LoginPanel from './LoginPanel';

function App() {
    const handleLogin = (username, password) => {
        console.log("Login Attempt:", username, password);
        // Implement the login logic here
    };

    return (
        <div className="App">
            <div className="map-container">
                <MapComponent />
            </div>
            <div className="login-container">
                <LoginPanel onLogin={handleLogin} />
            </div>
        </div>
    );
}

export default App;
