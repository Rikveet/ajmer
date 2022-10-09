import config from "../../../config.json";
import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {connectAuthEmulator, getAuth} from "firebase/auth";
import {connectFirestoreEmulator, getFirestore} from "firebase/firestore";
import {connectDatabaseEmulator, getDatabase} from "firebase/database";


export function initFirebase() {
    const firebaseApp = initializeApp(config["firebaseConfig"]);
    const analytics = getAnalytics(firebaseApp);
    const auth = getAuth();
    const firestore = getFirestore();
    const rdbms = getDatabase();
    if (config["LOCAL_DEV_MODE"]) {
        connectAuthEmulator(auth, "http://localhost:9099");
        connectFirestoreEmulator(firestore, 'localhost', 8080);
        connectDatabaseEmulator(rdbms, "localhost", 9000);
    }

    return ({
        "auth": auth,
        "firestore": firestore,
        "rdbms": rdbms
    });
}
