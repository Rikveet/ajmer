import {AnimatePresence} from "framer-motion";
import React, {useContext, useEffect, useState} from "react";
import {Button, Container, Form, Nav} from "react-bootstrap";
import {useLocalStoredState, useValidatedRef} from "../../../customHooks";
import {FadeInOut, Loading} from "../../motions";
import './index.scss';
import {ConfirmPasswordInput, EmailInput, PasswordInput} from "../../Shared";
import {FirebaseAppContext} from "../../../contexts/Firebase";
import {ModalMessageContext} from "../../../contexts/ModalMessageHandler";
import {
    createUserWithEmailAndPassword,
    fetchSignInMethodsForEmail,
    getAuth,
    sendEmailVerification,
    signInWithEmailAndPassword,
    UserCredential
} from "firebase/auth";
import {UserIDContext} from "../../../contexts/UserID";

const UserVerificationAddon = (props: { userCredentials: UserCredential }) => {
    const [emailSent, setEmailSent] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [buttonText, setButtonText] = useState("Send Another Request");

    return (<div className={'d-flex justify-content-center mb-2'}>
        <Button
            disabled={emailSent || processing}
            onClick={
                async () => {
                    setProcessing(true)
                    try {
                        await sendEmailVerification(props.userCredentials.user)
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
export const LoginSignupForm = () => {
    const [formType, setFormType] = useLocalStoredState('form_type');
    const [inputsValid, setInputsValid] = useState(false);
    const email = useValidatedRef(
        (email: string) => {

            const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return regex.test(email);
        });
    const password = useValidatedRef((password: string) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,20})/
        return password.length > 0 && regex.test(password);
    });
    const confirmPassword = useValidatedRef((password: string, confirmPassword: string) => {
        return password === confirmPassword;
    }, [password.ref]);
    const formButtonValidation = () => {
        if (formType === 'sign-up') {
            return Boolean((email.validate() && password.validate() && confirmPassword.validate()))
        } else {
            return Boolean((email.validate() && password.ref.current?.value && password.ref.current?.value.length > 0))
        }
    }
    const firebaseApp = useContext(FirebaseAppContext);
    const setAlert = useContext(ModalMessageContext);
    const UserID = useContext(UserIDContext);
    const [processingRequest, setProcessingRequest] = useState(false);

    useEffect(() => {
        setInputsValid(formButtonValidation())
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formType])
    const formSubmit = async () => {
        if (firebaseApp) {
            const auth = getAuth(firebaseApp)
            const checkIfAccountExists =  async () => {
                const possibleLogins = await fetchSignInMethodsForEmail(auth, email.ref.current!.value);
                return possibleLogins.length > 0;
            }
            if (!(email.validate() && password.validate())) {
                setAlert('Incorrect email or password', 'Invalid Submission')
                return;
            }
            switch (formType) {
                case 'login': {
                    try {
                        setProcessingRequest(true);
                        if (await checkIfAccountExists()) {
                            const userCredentials = await signInWithEmailAndPassword(auth, email.ref.current!.value, password.ref.current!.value)
                            if (!userCredentials.user.emailVerified) {
                                setAlert('Please check your email for the verification email and verify the account.',
                                    'Account Not Verified',
                                    <UserVerificationAddon userCredentials={userCredentials}/>
                                )
                                await auth.signOut()
                            } else {
                                UserID.set(userCredentials.user.uid)
                            }
                        } else {
                            setAlert('User does not exist.', 'Account Error')
                        }
                        setProcessingRequest(false);
                    } catch (e) {
                        setAlert('Email or password is invalid.', 'Form Submission Error')
                        setProcessingRequest(false);
                    }
                    break;
                }
                case 'sign-up': {
                    if (!(email.validate() && password.validate() && confirmPassword.validate())) {
                        setAlert('Not all inputs are filled or correct', 'Form Submission Error');
                        return;
                    }
                    try {
                        setProcessingRequest(true);
                        if (await checkIfAccountExists()) {
                            setAlert('Account already exists.', 'Invalid Email')
                        }
                        else{
                            const userCredentials = await createUserWithEmailAndPassword(auth, email.ref.current!.value, password.ref.current!.value);
                            await sendEmailVerification(userCredentials.user)
                            await auth.signOut();
                            setAlert('Please confirm your account by following the steps sent in the confirmation email. The email has been' +
                                ' sent on the account you registered with. Please make sure to check your spam or junk folder if the' +
                                ' confirmation' +
                                ' email is not visible in the inbox. You can request another email while logging in.', 'Account' +
                                ' Created')
                            setFormType('login')
                        }
                        setProcessingRequest(false);
                    } catch (e) {
                        setAlert('Server refused to create the account.', 'Request Error')
                        setProcessingRequest(false);
                    }
                    break;
                }
            }


        } else {
            setAlert('Unfortunately the server is not responding at the moment.')
        }
    }

    return (
        <div className={'form-container'}>
            <div className={'form'}>
                <Nav variant="tabs" defaultActiveKey={formType === 'sign-up' ? "Sign-Up" : 'Login'}>
                    <Nav.Item>
                        <Nav.Link eventKey="Login" onClick={() => {
                            setFormType('login')
                        }}>Login</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="Sign-Up" onClick={() => {
                            setFormType('sign-up')
                        }}>Sign-Up</Nav.Link>
                    </Nav.Item>
                </Nav>
                <Container>
                    <Form
                        onSubmit={(e) => {
                            e.preventDefault();
                            formSubmit().then(r => {}) // if need to do anything in future
                        }}
                        onChange={() => {
                            setInputsValid(formButtonValidation())
                        }}
                    >
                        <AnimatePresence>
                            {
                                formType === 'sign-up' ?
                                    <FadeInOut id={'sign-up'}>
                                        <EmailInput refVal={email} isValidated={true}/>
                                        <PasswordInput refVal={password} isValidated={true}/>
                                        <ConfirmPasswordInput refVal={confirmPassword} passwordRef={password.ref}/>
                                    </FadeInOut>
                                    :
                                    <FadeInOut id={'login'}>
                                        <EmailInput refVal={email} isValidated={false}/>
                                        <PasswordInput refVal={password} isValidated={false}/>
                                    </FadeInOut>
                            }
                        </AnimatePresence>
                        <Button variant="primary" type="submit" disabled={processingRequest || !inputsValid}>
                            {processingRequest ? <div className={'d-flex justify-content-center'}><Loading/></div> : "Submit"}
                        </Button>
                    </Form>
                </Container>
            </div>
        </div>
    )
}
