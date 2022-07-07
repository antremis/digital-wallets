import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import AuthContextProvider from './Context/AuthContext';
import UserContextProvider from './Context/UserContext';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.querySelector('body'));
root.render(
    <BrowserRouter>
        <AuthContextProvider >
            <UserContextProvider>
                    <App />
            </UserContextProvider>
        </AuthContextProvider>
    </BrowserRouter>
);
