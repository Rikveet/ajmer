import React, {useContext, useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import FirebaseContextProvider, {FirebaseAppContext} from "./contexts/Firebase";
import Account from "./routes/Account";
import Home from "./routes/Home";
import './index.scss';
import {ModalMessageContext, ModalMessageProvider} from "./contexts/ModalMessageHandler";
import Navbar from "./components/Navbar";
import UserIDProvider, {UserIDContext} from "./contexts/UserID";
import {DataFromFakeGeneratorT, ListingsT} from "./components/Shared";
import {createApi} from "unsplash-js";
import {v4 as uuid} from "uuid";
import Fakerator from "fakerator";
import {getAuth, sendEmailVerification, User} from "firebase/auth";
import {Button} from "react-bootstrap";
import {Loading} from "./components/motions";

const fakerator = Fakerator("en-CA");


const generateFakeData = async (loadData: React.Dispatch<React.SetStateAction<ListingsT>>) => {
    const getRandomInRange = (min: number, max: number): number => {
        return parseFloat(Math.floor(Math.random() * (max - min + 1) + min).toString())
    }
    let compiledData: ListingsT = [];
    const unsplash = createApi({accessKey: process.env.REACT_APP_FAKE_IMAGE_API_TOKEN as string});

    const data: DataFromFakeGeneratorT[] = []
    for (let i = 0; i < Number(process.env.REACT_APP_NUMBER_OF_FAKE_HOUSES); i++) {
        data.push({
            contacts: {email: fakerator.internet.email(), mobile: fakerator.phone.number()},
            first_name: fakerator.names.firstName(),
            last_name: fakerator.names.lastName(),
            location: {
                city: fakerator.address.city(),
                country: fakerator.address.country(),
                state: fakerator.address.city(),
                street: fakerator.address.street()
            }
        })
    }
    for (const entry of data) {
        try {
            const numberOfImages = Number(process.env.REACT_APP_NUMBER_OF_FAKE_IMAGES_PER_HOUSE);
            const result = numberOfImages > 0 ? await unsplash.photos.getRandom({
                query: 'house interior',
                count: Number(process.env.REACT_APP_NUMBER_OF_FAKE_IMAGES_PER_HOUSE)
            }) : {response: undefined};

            compiledData.push({
                info: {...entry},
                location: [43.000000 + getRandomInRange(602910, 813591) / 1000000, -79.000000 - getRandomInRange(727310, 786340) / 1000000],
                uuid: uuid(),
                images:
                    (result.response as
                        {
                            id: string,
                            description: string,
                            urls: { full: string }
                        }[]).map(
                        image => ({
                            id: image.id,
                            url: image.urls.full,
                            description: image.description
                        }))
            })
        } catch (e) {
            compiledData.push({
                info: {...entry},
                location: [43.000000 + getRandomInRange(602910, 813591) / 1000000, -79.000000 - getRandomInRange(727310, 786340) / 1000000],
                uuid: uuid()
            })
        }
    }
    loadData(compiledData)
}

const UserVerificationAddon = (props: { user: User}) => {
    const [emailSent, setEmailSent] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [buttonText, setButtonText] = useState("Send Another Request");

    return (
        <div className={'d-flex justify-content-center mb-2'}>
            <Button
                disabled={emailSent || processing}
                onClick={
                    async () => {
                        setProcessing(true)
                        try {
                            await sendEmailVerification(props.user)
                            setButtonText('Email Sent')
                        } catch (e) {
                            setButtonText('Failed')
                        }
                        setProcessing(false)
                        setEmailSent(true)
                    }
                }>
                {processing ? <Loading/> : buttonText}
            </Button>
        </div>)
}

const App = () => {
    const [listings, setListings] = useState<ListingsT>([]);
    const [loading, setLoading] = useState(true);
    const userID = useContext(UserIDContext)
    const setAlert = useContext(ModalMessageContext)
    useEffect(() => {
        generateFakeData(setListings).then(() => {
            setLoading(false)
        })
    }, []);
    useEffect(() => {
            const checkIfVerified = async () => {
                if (userID) {
                    const auth = getAuth()
                    const user = auth.currentUser
                    if (user && !user.emailVerified) {
                        setAlert('Please check your email for the verification email and verify the account.',
                            'Account Not Verified', <UserVerificationAddon user={user}/>, undefined)
                        await auth.signOut()
                    }
                }
            }
            checkIfVerified()
        },
        [userID])
    const FirebaseApp = useContext(FirebaseAppContext);
    const router = createBrowserRouter(
        createRoutesFromElements(
            FirebaseApp ?
                <Route path={''} element={<Navbar/>}>
                    <Route path={'/'} element={<Home loading={loading} listings={listings}/>}/>
                    <Route path={'user'} element={<Account/>}/>
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
