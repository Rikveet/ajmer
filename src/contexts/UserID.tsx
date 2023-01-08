import {getAuth, onAuthStateChanged, sendEmailVerification, User} from "firebase/auth";
import * as React from "react";
import {ReactNode, useContext, useState} from "react";
import {ModalMessageContext} from "./ModalMessageHandler";
import {Button} from "react-bootstrap";
import {Loading} from "../components/motions";


export const UserIDContext = React.createContext<string | null>(null);



function UserIDProvider(props: { children: ReactNode }) {
    const [uid, setUid] = useState<string | null>(null);
    const auth = getAuth()
    onAuthStateChanged(auth, async user => {
        if (user) {
            setUid(user.uid)
        } else {
            setUid(null)
        }
    })
    return (
        <UserIDContext.Provider value={uid}>
            {props.children}
        </UserIDContext.Provider>
    );
}

export default UserIDProvider;
