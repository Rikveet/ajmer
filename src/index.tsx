import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, RouterProvider,} from "react-router-dom";
import FirebaseContextProvider from "./contexts/Firebase";
import Home from "./routes/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Navbar from "./components/Navbar/Navbar";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
const router = createBrowserRouter([
    {
        path: "/",
        element: <Home/>,
    },
])
root.render(
    <React.StrictMode>
        <FirebaseContextProvider>
            <Navbar/>
            <RouterProvider router={router}/>
        </FirebaseContextProvider>
    </React.StrictMode>
);
