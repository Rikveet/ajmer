import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from "react-router-dom";
import {FIREBASE_FUNCTIONS} from "./components/contexts/firebase";
import {initFirebase} from "./components/contexts/firebase/initializer";
import ServerNotFound from "./components/pages/serverNotFound";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        {FIREBASE_FUNCTIONS ?
            <FIREBASE_FUNCTIONS.Provider value={initFirebase()}>
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
            </FIREBASE_FUNCTIONS.Provider>
            :
            <ServerNotFound/>
        }
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
