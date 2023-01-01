import * as React from "react";
import {ReactNode, useState} from "react";


type UserIDT = { uid: string | null, set: { (uid: string): void } }

export const UserIDContext = React.createContext<UserIDT>({} as unknown as UserIDT);

function UserIDProvider(props: { children: ReactNode }) {
    const [uid, setUid] = useState<string | null>(null);
    return (
        <UserIDContext.Provider value={{uid: uid, set: setUid}}>
            {props.children}
        </UserIDContext.Provider>
    );
}

export default UserIDProvider;
