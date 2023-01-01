import React, {useContext} from 'react';
import ReactDOM from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import FirebaseContextProvider, {FirebaseAppContext} from "./contexts/Firebase";
import User from "./routes/User";
import Home from "./routes/Home";
import './index.scss';
import {ModalMessageProvider} from "./contexts/ModalMessageHandler";
import Navbar from "./components/Navbar";
import UserIDProvider from "./contexts/UserID";

const App = () => {
    const FirebaseApp = useContext(FirebaseAppContext);
    const router = createBrowserRouter(
        createRoutesFromElements(
            FirebaseApp ?
                <Route path={''} element={<Navbar/>}>
                    <Route path={'/'} element={<Home/>}/>
                    <Route path={'user'} element={<User/>}/>
                </Route>
                :
                <Route path={'/'} element={<> Firebase Server not working.</>}/>
        ));
    return (<RouterProvider router={router}/>)
}


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <FirebaseContextProvider>
            <UserIDProvider>
                <ModalMessageProvider>
                    <App/>
                </ModalMessageProvider>
            </UserIDProvider>
        </FirebaseContextProvider>
    </React.StrictMode>
);
