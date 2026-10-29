import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { TripProvider } from './context/TripContext.jsx';
import { BackdropProvider } from './context/BackdropContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TripProvider>
          <BackdropProvider>
            <App />
          </BackdropProvider>
        </TripProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
