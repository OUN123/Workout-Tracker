import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from 'react-router-dom';
import App from "./App";
import { AuthProvider } from './components/auth/AuthContext';

ReactDOM.render(
    <React.StrictMode>
      <Router>
        <AuthProvider>
          <App /> {/* App is used here inside the Router and AuthProvider */}
        </AuthProvider>
      </Router>
    </React.StrictMode>,
    document.getElementById('root')
  );
