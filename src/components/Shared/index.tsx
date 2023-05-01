import {useLocalStoredState, ValidatedRef} from "../../customHooks";
import {Col, Form, InputGroup, Placeholder, Row} from "react-bootstrap";
import React, {RefObject, useEffect, useState} from "react";
import {LatLngTuple} from "leaflet";


export type DataFromFakeGeneratorT = {
    first_name: string,
    last_name: string,
    location: {
        street: string,
        city: string,
        state: string,
        country: string
    },
    contacts: {
        email: string,
        mobile: string
    },
}
export type ListingsT = { info: DataFromFakeGeneratorT, images?: { id: string, url: string, description: string }[], location: LatLngTuple, uuid: string }[]


export const TextInput = (
    props: {
        refVal: ValidatedRef | React.RefObject<HTMLInputElement>,
        inputType?: string,
        label: string,
        ariaDesc: string,
        persistenceKey?: string,
        placeHolderText?: string,
        prependText?: string,
        invalidText?: string,
        additionalInfo?: string,
        isCol?: boolean,
        isRequired: boolean,
        isLoading?: boolean,
        isExpectingAValue?: boolean
    }) => {
    const {
        inputType,
        label,
        ariaDesc,
        persistenceKey,
        placeHolderText,
        prependText,
        invalidText,
        additionalInfo,
        isCol,
        isRequired,
        isLoading,
        isExpectingAValue
    } = {...props}
    // next 3 lines are hideous 🤢, will take additional memory just because I cant have hook depending on conditional.
    const [_value, _setValue] = useState<string>("")
    const [_localStoredValue, _setLocalStoredValue] = useLocalStoredState(persistenceKey || crypto.randomUUID())
    const [value, setValue] = persistenceKey ? [_localStoredValue, _setLocalStoredValue] : [_value, _setValue]
    const [isValidIndicator, setIsValidIndicator] = useState({})
    const [firstTimeInputFlag, setFirstInputFlag] = useState(false);
    const ref = props.refVal.hasOwnProperty('validate') ? (props.refVal as ValidatedRef).ref : props.refVal as React.RefObject<HTMLInputElement>
    const validate = props.refVal.hasOwnProperty('validate') ? (props.refVal as ValidatedRef).validate : undefined
    useEffect(() => {
        if (validate) {
            if ((!firstTimeInputFlag && props.refVal.hasOwnProperty('validate')) || (!isRequired && value.length===0)) {
                setIsValidIndicator({isValid:false, isInvalid: false})
            } else {
                setIsValidIndicator(validate() ? {isValid: true} : {isInvalid: true})
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])
    useEffect(()=>{
        if(!isLoading && isLoading!==undefined){
            //console.log(isExpectingAValue)
            if(isExpectingAValue){
                const interval = setInterval(()=>{
                    if(ref.current?.value){
                        _setValue(ref.current.value)
                        clearInterval(interval)
                    }

                },100)
            }
            //_setValue(ref.current.value)
        }
    },[isLoading, isExpectingAValue])

    const boostrapForID = crypto.randomUUID()
    return (
        <Form.Group className="mb-2 px-1" as={isCol ? Col : Row}>
            <Form.Label htmlFor={boostrapForID}>{label}</Form.Label>
            {
                isLoading?
                    <Placeholder as="p" animation="glow">
                        <Placeholder xs={12} />
                    </Placeholder>
                    :
                    <>
                        <InputGroup hasValidation>
                            {prependText && <InputGroup.Text id="inputGroupPrepend">{prependText}</InputGroup.Text>}
                            <Form.Control
                                type={inputType || 'text'}
                                id={boostrapForID}
                                aria-describedby={ariaDesc}
                                value={value}
                                ref={ref}

                                onChange={(e) => {
                                    if (!firstTimeInputFlag) {
                                        setFirstInputFlag(true)
                                    }
                                    setValue(e.target.value)
                                }}
                                placeholder={placeHolderText}
                                {...isValidIndicator}
                            />
                            <Form.Control.Feedback type="invalid">
                                <>
                                    {value.length===0 && <>*Required<br/></>}  {Boolean(invalidText) && invalidText}
                                </>
                            </Form.Control.Feedback>
                        </InputGroup>
                        {Boolean(additionalInfo) &&
                            <Form.Text muted>
                                {additionalInfo}
                            </Form.Text>
                        }
                    </>
            }
        </Form.Group>
    )
}


export const EmailInput = (props: { refVal: ValidatedRef, isValidated?: boolean }) => {
    const validationText = props.isValidated ? {invalidText: 'Invalid Email'} : {}
    return (
        <TextInput refVal={props.refVal}
                   label={'Email'}
                   placeHolderText={'johndoe@gmail.com'}
                   inputType={'email'}
                   ariaDesc={'email block'}
                   prependText={"@"}
                   {...validationText}
                   additionalInfo={'You would need to verify this email before you log in.'}
                   persistenceKey={'email'}
                   isRequired={true}
        />
    )
}

export const PasswordInput = (props: { refVal: ValidatedRef, isValidated?: boolean }) => {
    const validationText = props.isValidated ? {invalidText: 'Your password must be 8-20 characters long, contain letters (upper-case and lower-case) and numbers, and at least 1 special character.'} : {}
    return (
        <TextInput refVal={props.refVal}
                   label={'Password'}
                   inputType={'password'}
                   ariaDesc={'password block'}
                   {...validationText}
                   isRequired={true}
        />
    )
}

export const ConfirmPasswordInput = (props: { refVal: ValidatedRef, passwordRef: RefObject<HTMLInputElement> }) => {
    return (
        <TextInput refVal={props.refVal}
                   label={'Confirm Password'}
                   inputType={'password'}
                   ariaDesc={'confirm password block'}
                   invalidText={'Passwords do not match.'}
                   isRequired={true}
        />
    )
}

export const removeSameValueEntries = (from: {[key:string]:any}, compareTo: {[key:string]:any})=>{
    const result = from
    for(const [key,value] of Object.entries(from)){
        if(compareTo[key] !== undefined && compareTo[key]===value){
            delete result[key]
        }
    }
    return result
}
