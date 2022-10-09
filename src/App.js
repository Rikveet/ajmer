import './App.css';
import {Route, Routes} from "react-router-dom";
import Home from "./components/pages/home/home";
import PageNotFound from "./components/pages/404";
import Navbar from "./components/navbar";

function App() {
    return (
        <>
            <Navbar/>
            <Routes>
                <Route path={"/"} element={<Home/>}/>
                <Route path={"*"} element={<PageNotFound/>}/>
            </Routes>
        </>
    );
}

export default App;
