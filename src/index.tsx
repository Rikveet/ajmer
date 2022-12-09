import React from 'react';
import ReactDOM from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import {createBrowserRouter, RouterProvider,} from "react-router-dom";
import FirebaseContextProvider from "./contexts/Firebase";
import Navbar from "./components/Navbar";
import User from "./routes/User";
import Home from "./routes/Home";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
const router = createBrowserRouter([
    {
        path: "/",
        element: <Navbar/>,
        children: [
            {
                path: '',
                element: <Home/>
            },
            {
                path: 'user',
                element: <User/>
            }
        ]
    },
])
root.render(
    <React.StrictMode>
        <FirebaseContextProvider>
            <RouterProvider router={router}/>
        </FirebaseContextProvider>
    </React.StrictMode>
);
