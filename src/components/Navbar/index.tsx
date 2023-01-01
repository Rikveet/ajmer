import React, {ReactNode, useContext, useEffect, useState} from 'react';
import "./index.scss";
import {Outlet, useLocation} from 'react-router-dom';
import {FirebaseAppContext} from "../../contexts/Firebase";
import {getAuth} from "firebase/auth";

function Navbar() {
    const location = useLocation();
    const firebase = useContext(FirebaseAppContext);
    const [links, setLinks] = useState<{
        text: string | ReactNode,
        href?: string,
        onClick?: { (): void }
    }[]>([{text: 'Home', href: '/'}]);
    useEffect(() => {
        if (firebase) {
            const auth = getAuth(firebase);
            if (auth.currentUser) {
                setLinks([...links,
                    {
                        text: "Log-Out",
                        onClick: async () => {
                            try {
                                await auth.signOut()
                            } catch (e) {

                            }
                        }
                    }])
            } else {
                setLinks([
                    ...links,
                    {
                        text: <i className="bi bi-person-fill fs-3 text-white"/>,
                        href: '/user'
                    }
                ])
            }
        } else {

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [firebase]);
    return (
        <div>
            <nav className="navbar navbar-expand-sm navbar-dark sticky-top">
                <div className="container-fluid">
                    <h1 className="navbar-brand" >AJMER</h1>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
                        <ul className="nav nav-pills nav-justified align-items-center">
                            {links.map((link, index) => {
                                return (
                                    <li className="nav-item px-3" key={index}>
                                        <a className={
                                            'nav-link' +
                                            (
                                                link.href &&
                                                location.pathname === link.href ?
                                                    " active" : ""
                                            ) +
                                            (
                                                typeof link.text === "string" ?
                                                    '' : ' py-0'
                                            )
                                        }
                                           aria-current="page"
                                           href={link.href}
                                           onClick={link.onClick}
                                        >{link.text}</a>
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
