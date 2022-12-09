import React from 'react';
import "./Navbar.scss";
import {Outlet, useLocation} from 'react-router-dom';

function Navbar() {
    const location = useLocation();
    const links = [
        {
            text: 'Home',
            link: '/'
        }
    ]
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark sticky-top">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Navbar</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="nav nav-pills me-auto mb-2 mb-lg-0">
                            {links.map(link => {
                                return (
                                    <li className="nav-item" key={link.text}>
                                        <a className={"nav-link" + location.pathname.includes(link.text) ? 'active' : ''} aria-current="page"
                                           href={link.link}>Home</a>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
            </nav>
            <Outlet/>
        </div>
    );
}

export default Navbar;
