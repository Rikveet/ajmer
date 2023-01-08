import React, {useContext, useEffect, useRef, useState} from 'react';
import './index.scss'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {Alert, Col, Placeholder, Row} from "react-bootstrap";
import {removeSameValueEntries, TextInput} from "../../Shared";
import provinces from 'provinces-ca';
import {useValidatedRef} from "../../../customHooks";
import {ModalMessageContext} from "../../../contexts/ModalMessageHandler";
import {set, update, UserInfoT} from "../../Database";
import {UserIDContext} from "../../../contexts/UserID";
import {Loading} from '../../motions';


const EmailPasswordVerification = (props: { email?: string, phoneNumber?: string, verificationCompleted: Function }) => {
    const {email, phoneNumber, verificationCompleted} = {...props}
    const [emailVerified, setEmailVerified] = useState(false);
    const [phoneNumberVerified, setPhoneNumberVerified] = useState(false);
    useEffect(() => {
        if ((email && phoneNumber && emailVerified && phoneNumberVerified) || (email && (phoneNumber === undefined) && emailVerified) || (phoneNumber && (email === undefined) && phoneNumberVerified)) {
            verificationCompleted()
        }
    }, [phoneNumberVerified, emailVerified]);

    return (
        <div className={'d-flex flex-column px-3 align-items-center justify-content-center'}>
            Currently custom email/phone number verification system could not be implemented as it would require a paid package.
            {
                email &&
                <Button className={'my-2 w-75'}
                        onClick={() => {
                            setEmailVerified(true)
                        }}>
                    {emailVerified ? 'Email Verified' : 'Verify Email'}
                </Button>
            }
            {
                phoneNumber &&
                <Button className={'mb-2 w-75'}
                        onClick={() => {
                            setPhoneNumberVerified(true)
                        }}>
                    {phoneNumberVerified ? 'Phone Number Verified' : 'Verify Phone Number'}
                </Button>
            }
        </div>
    )
}

function UserAboutForm(props: { userInfoOnServer: UserInfoT | undefined, setUserInfoOnServer: { (info: UserInfoT): void }, readingDataFromServer: boolean }) {
    const firstName = useValidatedRef((value) => {
        return value.length >= 2 && value.length <= 50
    })
    const lastName = useValidatedRef((value) => {
        return value.length >= 2 && value.length <= 50
    })
    const email = useValidatedRef((value) => {
        return value.length >= 5 && value.length <= 50
    })
    const phoneNumber = useValidatedRef((value) => {
        return value.length === 10
    })
    const streetAddress = useValidatedRef((value) => {
        return value.length >= 1 && value.length <= 50
    })
    const city = useValidatedRef((value) => {
        return value.length >= 1 && value.length <= 30
    })
    const validProvinces: string[] = provinces.filter((x) => !x.territory).map(value => value.name)
    const [province, setProvince] = useState<string>(validProvinces[0])
    const zip = useValidatedRef((value) => {
        return /^\s*[a-ceghj-npr-tvxy]\d[a-ceghj-npr-tv-z](\s)?\d[a-ceghj-npr-tv-z]\d\s*$/i.test(value) && value.length === 7
    })

    const [processing, setProcessing] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true)
    const verificationCompleted = useRef({email: false, phoneNumber: false})
    const [updateRequired, setUpdateRequired] = useState(false)
    const {userInfoOnServer, setUserInfoOnServer, readingDataFromServer} = {...props}
    const [userDataFromServerLoaded, setUserDataFromServerLoaded] = useState(false)
    const setAlert = useContext(ModalMessageContext);
    const userId = useContext(UserIDContext);

    useEffect(() => {
        if (userId) {
            if (!readingDataFromServer && !userDataFromServerLoaded) {
                const interval = setInterval(() => {
                    if (firstName.ref.current && lastName.ref.current && email.ref.current && phoneNumber.ref.current && streetAddress.ref.current && city.ref.current && zip.ref.current && userInfoOnServer) {
                        const data = userInfoOnServer
                        if (firstName.ref.current.value === data.firstName) {
                            clearInterval(interval)
                        }
                        firstName.ref.current.value = data.firstName
                        lastName.ref.current.value = data.lastName
                        if (data.email) {
                            email.ref.current.value = data.email
                            verificationCompleted.current.email = true
                        }
                        if (data.phoneNumber) {
                            phoneNumber.ref.current.value = data.phoneNumber
                            verificationCompleted.current.phoneNumber = true
                        }
                        streetAddress.ref.current.value = data.address
                        city.ref.current.value = data.city
                        zip.ref.current.value = data.zip
                        setProvince(data.province)
                        setUserDataFromServerLoaded(true)
                    }
                }, 100)
            } else {
                setUpdateRequired(true)
            }
        } else {
            console.info('Did not load user info from server because user id is null')
        }
    }, [userInfoOnServer])

    const submitHandler = () => {
        setProcessing(true)
        const emailProvided = email.ref.current?.value !== null && email.ref.current!.value.length > 0;
        const phoneNumberProvided = phoneNumber.ref.current?.value !== null && phoneNumber.ref.current!.value.length > 0
        const loadInfoToFirebase = async () => {
            if (userId) {
                try {
                    let payload: UserInfoT = {
                        firstName: firstName.ref.current!.value,
                        lastName: lastName.ref.current!.value,
                        address: streetAddress.ref.current!.value,
                        city: city.ref.current!.value,
                        zip: zip.ref.current!.value,
                        province: province
                    }
                    if (emailProvided) {
                        payload = {
                            ...payload,
                            email: email.ref.current?.value || ''
                        }
                    }
                    if (phoneNumberProvided) {
                        payload = {
                            ...payload,
                            phoneNumber: phoneNumber.ref.current?.value || ''
                        }
                    }
                    let result;
                    const emailRemoved = (!emailProvided && userInfoOnServer?.email)
                    const phoneNumberRemoved = (!phoneNumberProvided && userInfoOnServer?.phoneNumber)
                    if (!userInfoOnServer || emailRemoved || phoneNumberRemoved) {
                        result = await set({collection: 'users', segments: [userId]}, payload)
                        if (result) {
                            setAlert(`Your information was uploaded. ${!userInfoOnServer?"Now you can access other features of the app.":''}${emailRemoved?'Email removed.':''}${phoneNumberRemoved?'Phone number removed.':''}`, 'Success')
                            setUserInfoOnServer(payload)
                        }
                    } else {
                        const updatePayload = removeSameValueEntries(payload, userInfoOnServer)
                        if (Object.entries(updatePayload).length > 0) {
                            //console.log('updating', updatePayload)
                            result = await update({collection: 'users', segments: [userId]}, updatePayload)
                            if (result) {
                                setAlert("Your information was updated.", 'Success')
                                setUserInfoOnServer(payload)
                                setUpdateRequired(false);
                            }
                        } else {
                            result = {res: true};
                            setAlert("Nothing to update!", 'No change')
                            setUpdateRequired(false);
                        }
                    }
                    if (!result || !result.res) {
                        setAlert('Request failed, server refused to update. ' + result?.error, 'Failed')
                    }
                } catch (e) {
                    setAlert('Could not process the request. Try again later.', 'Form submission error')
                }
            }
        }
        if ((emailProvided && !verificationCompleted.current.email) || (phoneNumberProvided && !verificationCompleted.current.phoneNumber)) {
            const bothProvided = emailProvided && phoneNumberProvided
            setAlert(`To save your ${emailProvided && 'email'} ${bothProvided && 'and'} ${phoneNumberProvided && 'phone number'} in contact info we would need you to verify ${bothProvided ? 'them' : 'it'}.`, 'Email verification required',
                <EmailPasswordVerification
                    email={verificationCompleted.current.email ? undefined : email.ref.current?.value && email.ref.current?.value.length > 0 ? email.ref.current.value : undefined}
                    phoneNumber={verificationCompleted.current.phoneNumber ? undefined : phoneNumber.ref.current?.value && phoneNumber.ref.current?.value.length > 0 ? phoneNumber.ref.current.value : undefined}
                    verificationCompleted={() => {
                        verificationCompleted.current.email = true
                        verificationCompleted.current.phoneNumber = true
                    }}
                />
                , {
                    text: 'Submit', callBack: () => {
                        if ((emailProvided ? verificationCompleted.current.email : true) && (phoneNumberProvided ? verificationCompleted.current.phoneNumber : true)) {
                            loadInfoToFirebase().then(() => {
                                setProcessing(false)
                            })
                            return true;
                        } else {
                            setProcessing(false)
                            return false;
                        }

                    }
                })
        } else if ((emailProvided ? verificationCompleted.current.email : true) && (phoneNumberProvided ? verificationCompleted.current.phoneNumber : true)) {
            loadInfoToFirebase().then(() => {
                setProcessing(false)
            })
        } else {
            setProcessing(false)
        }

    }

    return (
        <div className={'form-container'} id={'about-form'}>
            <div className={'form'}>
                <Alert variant={'warning'}>
                    As this app is currently in prototype mode. You should not post your actual information in the form. We try our best to secure the information posted but do not guarantee safety
                </Alert>
                <Form id={'form'} className={'mx-3 w-100'} onSubmit={(e) => {
                    e.preventDefault()
                    submitHandler()
                }}
                      onChange={() => {
                          setIsDisabled(processing ||
                              !(
                                  firstName.validate() &&
                                  lastName.validate() &&
                                  streetAddress.validate() &&
                                  city.validate() &&
                                  zip.validate()
                              ) ||
                              !(
                                  (email.ref.current?.value !== null && email.ref.current!.value.length > 0 && email.validate()) || email.ref.current?.value === null || email.ref.current?.value.length === 0
                              ) ||
                              !(
                                  (phoneNumber.ref.current?.value !== null && phoneNumber.ref.current!.value.length > 0 && phoneNumber.validate()) ||
                                  phoneNumber.ref.current?.value === null || phoneNumber.ref.current?.value.length === 0
                              ))
                          if (!readingDataFromServer) {
                              setUpdateRequired(true)
                              verificationCompleted.current.email = !!(userInfoOnServer && userInfoOnServer.email && (email.ref.current?.value === userInfoOnServer.email))
                              verificationCompleted.current.phoneNumber = !!(userInfoOnServer && userInfoOnServer.phoneNumber && (phoneNumber.ref.current?.value === userInfoOnServer.phoneNumber))
                          }
                      }}
                >

                    <>
                        <Row className="mb-0 px-2">
                            <TextInput refVal={firstName}
                                       label={'First Name'}
                                       ariaDesc={'First name input block'}
                                       placeHolderText={'John'}
                                       isCol={true}
                                       isRequired={true}
                                       isLoading={readingDataFromServer}
                                       isExpectingAValue={Boolean(userInfoOnServer?.firstName)}
                            />
                            <TextInput refVal={lastName}
                                       label={'Last Name'}
                                       ariaDesc={'Last name input block'}
                                       placeHolderText={'Doe'}
                                       isCol={true}
                                       isRequired={true}
                                       isLoading={readingDataFromServer}
                                       isExpectingAValue={Boolean(userInfoOnServer?.lastName)}/>
                        </Row>
                        <Row className="mb-0 px-2">
                            <TextInput refVal={email}
                                       label={'Email'}
                                       ariaDesc={'Email input box'}
                                       invalidText={'Invalid email'}
                                       placeHolderText={'johndoe@gmail.com'}
                                       inputType={'email'}
                                       additionalInfo={'Verification required on submission'}
                                       prependText={'@'}
                                       isRequired={false}
                                       isLoading={readingDataFromServer}
                                       isExpectingAValue={Boolean(userInfoOnServer?.email)}/>
                            <TextInput refVal={phoneNumber}
                                       label={'Phone number'}
                                       ariaDesc={'Phone number input box'}
                                       invalidText={'Invalid Phone number'}
                                       placeHolderText={'123456789'}
                                       inputType={'tel'}
                                       additionalInfo={'Verification required on submission'}
                                       prependText={'📱'}
                                       isRequired={false}
                                       isLoading={readingDataFromServer}
                                       isExpectingAValue={Boolean(userInfoOnServer?.phoneNumber)}/>
                        </Row>
                        <Row className="mb-2 px-2">
                            <TextInput refVal={streetAddress}
                                       label={'Address'}
                                       ariaDesc={'Street address input block'}
                                       placeHolderText={'123 This Street'}
                                       isCol={true}
                                       isRequired={true}
                                       isLoading={readingDataFromServer}
                                       isExpectingAValue={Boolean(userInfoOnServer?.address)}/>
                            <TextInput refVal={zip}
                                       label={'Zip'}
                                       ariaDesc={'Zip code input block'}
                                       placeHolderText={'W1X Y2Z'}
                                       isCol={true}
                                       isRequired={true}
                                       isLoading={readingDataFromServer}
                                       isExpectingAValue={Boolean(userInfoOnServer?.zip)}/>
                        </Row>
                        <Row className="mb-2 px-2">
                            <TextInput refVal={city}
                                       label={'City'}
                                       ariaDesc={'City input block'}
                                       isCol={true}
                                       isRequired={true}
                                       isLoading={readingDataFromServer}
                                       isExpectingAValue={Boolean(userInfoOnServer?.city)}/>
                            <Form.Group as={Col} className={'mb-0 px-2'} controlId="formGridState">
                                <Form.Label className={''}>State</Form.Label>
                                {readingDataFromServer ?
                                    <Placeholder as="p" animation="glow">
                                        <Placeholder lg={12}/>
                                    </Placeholder> :
                                    <>
                                        <Form.Select defaultValue="Choose...">
                                            {validProvinces.map(value => (<option key={value} onClick={() => {
                                                setProvince(value)
                                            }}>{value}</option>))}
                                        </Form.Select>
                                    </>
                                }

                            </Form.Group>
                        </Row>

                        <Button variant="primary" type="submit" disabled={
                            isDisabled || !updateRequired
                        }>
                            {processing || readingDataFromServer ? <Loading/> : 'Update Profile'}
                        </Button>
                    </>

                </Form>
            </div>

        </div>
    );
}

export default UserAboutForm;
