import React, {ReactNode, useContext, useEffect, useState} from 'react';
import "./index.scss";
import {Outlet, useLocation, useNavigate} from 'react-router-dom';
import {FirebaseAppContext} from "../../contexts/Firebase";
import {getAuth} from "firebase/auth";
import {UserIDContext} from "../../contexts/UserID";
import {Nav} from "react-bootstrap";

function Navbar() {
    const location = useLocation();
    const firebase = useContext(FirebaseAppContext);
    const userID = useContext(UserIDContext);

    const defaultLinks = [
        {text: 'Home', href: '/'},
        {
            text: <i className="bi bi-person-fill fs-3 text-white"/>,
            href: '/user'
        }
    ]
    const [links, setLinks] = useState<{
        text: string | ReactNode,
        href?: string,
        onClick?: { (): void }
    }[]>([...defaultLinks]);
    useEffect(() => {
        if (firebase) {
            if (userID.uid) {
                setLinks([...defaultLinks,
                    {
                        text: "Log-Out",
                        onClick: async () => {
                            try {
                                const auth = getAuth(firebase);
                                await auth.signOut()
                                userID.set(null)
                            } catch (e) {

                            }
                        }
                    }])
            } else {
                setLinks([...defaultLinks])
            }
        } else {

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userID.uid]);
    const nav = useNavigate()
    return (
        <div>
            <nav className="navbar navbar-expand-sm navbar-dark sticky-top">
                <div className="container-fluid">
                    <h1 className="navbar-brand">AJMER</h1>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
                        <Nav className={'d-flex flex-column flex-lg-row justify-content-center align-items-center'} variant="pills" defaultActiveKey="/home">
                            {links.map((link, index) => (
                                <Nav.Item className={'px-2 py-2'} key={index}>
                                    <Nav.Link
                                        className={
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
                                        onClick={() => {
                                            if (link.href) {
                                                nav(link.href)
                                                return;
                                            }
                                            if (link.onClick) {
                                                link.onClick()
                                            }
                                        }}>{link.text}</Nav.Link>
                                </Nav.Item>
                            ))}
                        </Nav>
                    </div>
                </div>
            </nav>
            <Outlet/>
        </div>
    );
}

export default Navbar;
