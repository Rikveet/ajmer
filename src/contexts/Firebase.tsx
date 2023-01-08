// Import the functions you need from the SDKs you need
import * as React from 'react';
import {ReactNode} from 'react';
import {FirebaseApp, getApp, getApps, initializeApp} from "firebase/app";
import {connectAuthEmulator, getAuth} from "firebase/auth";
import {connectFirestoreEmulator, getFirestore} from "firebase/firestore";
import {getStorage, connectStorageEmulator} from 'firebase/storage';


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_REALTIME_DATABASE,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

function getFirebaseApp(): FirebaseApp | null {
    try{
        const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
        const auth = getAuth(firebaseApp);
        const db = getFirestore(firebaseApp);
        const storage = getStorage(firebaseApp)
        if (process.env.REACT_APP_DEVELOPEMENT_MODE==='true') {
            connectAuthEmulator(auth, "http://localhost:9099");
            connectFirestoreEmulator(db, 'localhost', 8080);
            connectStorageEmulator(storage,'localhost',9199)
        }
        return firebaseApp;
    }
    catch (e) {
        return null
    }
}

export const FirebaseAppContext = React.createContext<FirebaseApp | null>(null);

function FirebaseContextProvider(props: { children: ReactNode }) {
    const firebaseApp = getFirebaseApp();
    return (
        <FirebaseAppContext.Provider value={firebaseApp}>
            {props.children}
        </FirebaseAppContext.Provider>
    );
}

export default FirebaseContextProvider;
