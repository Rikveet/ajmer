import {useLocalStoredState, ValidatedRef} from "../../customHooks";
import {Form, InputGroup} from "react-bootstrap";
import {RefObject, useEffect, useState} from "react";

export const TextInput = (
    props: {
        refVal: ValidatedRef,
        inputType?: string,
        label: string,
        ariaDesc: string,
        persistenceKey?: string,
        placeHolderText?: string,
        prependText?: string,
        invalidText?: string,
        additionalInfo?: string
    }) => {
    const {
        inputType,
        label,
        ariaDesc,
        persistenceKey,
        placeHolderText,
        prependText,
        invalidText,
        additionalInfo
    } = {...props}
    // next 3 lines are hideous 🤢, will take additional memory just because I cant have hook depending on conditional.
    const [_value, _setValue] = useState<string>("")
    const [_localStoredValue, _setLocalStoredValue] = useLocalStoredState(persistenceKey || crypto.randomUUID())
    const [value, setValue] = persistenceKey ? [_localStoredValue, _setLocalStoredValue] : [_value, _setValue]
    const [isValidIndicator, setIsValidIndicator] = useState({})
    const {ref, validate} = {...props.refVal}
    useEffect(() => {
        if ( !Boolean(invalidText) || value.length === 0) {
            setIsValidIndicator({})
        } else {
            setIsValidIndicator(validate() ? {isValid: true} : {isInvalid: true})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])
    const boostrapForID = crypto.randomUUID()
    return (
        <Form.Group className="mb-3"> {/*email*/}
            <Form.Label htmlFor={boostrapForID}>{label}</Form.Label>
            <InputGroup hasValidation>
                {prependText && <InputGroup.Text id="inputGroupPrepend">{prependText}</InputGroup.Text>}
                <Form.Control
                    type={inputType || 'text'}
                    id={boostrapForID}
                    aria-describedby={ariaDesc}
                    value={value}
                    ref={ref}
                    onChange={(e) => {
                        setValue(e.target.value)
                    }}
                    placeholder={placeHolderText}
                    {...isValidIndicator}
                />
                {Boolean(invalidText) &&
                    <Form.Control.Feedback type="invalid">
                        {invalidText}
                    </Form.Control.Feedback>
                }
            </InputGroup>
            {Boolean(additionalInfo) &&
                <Form.Text muted>
                    {additionalInfo}
                </Form.Text>
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
        />
    )
}
