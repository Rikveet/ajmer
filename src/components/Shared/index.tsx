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
        prependText: string,
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
    const [_value, _setValue] =   useState<string>("")
    const [_localStoredValue, _setLocalStoredValue] =  useLocalStoredState(persistenceKey || crypto.randomUUID())
    const [value, setValue] = persistenceKey? [_localStoredValue, _setLocalStoredValue] : [_value, _setValue]
    const [isValidIndicator, setIsValidIndicator] = useState(false)
    const {ref, validate} = {...props.refVal}
    useEffect(() => {
        setIsValidIndicator(value.length > 0 && validate())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])
    const boostrapForID = crypto.randomUUID()
    return (
        <Form.Group className="mb-3"> {/*email*/}
            <Form.Label htmlFor={boostrapForID}>{label}</Form.Label>
            <InputGroup hasValidation>
                { prependText && <InputGroup.Text id="inputGroupPrepend">{prependText}</InputGroup.Text>}
                <Form.Control
                    type={inputType || 'text'}
                    id={boostrapForID}
                    aria-describedby={ariaDesc}
                    value={value}
                    ref={ref}
                    onChange={(e) => {
                        setValue(e.target.value)
                    }}
                    isInvalid={isValidIndicator}
                    isValid={isValidIndicator}
                    placeholder={placeHolderText}
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
    const [email, setEmail] = useLocalStoredState('email');
    const [isValidIndicator, setIsValidIndicator] = useState(false)
    const {ref, validate} = {...props.refVal}

    useEffect(() => {
        setIsValidIndicator(email.length > 0 && validate())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [email])
    return (
        <Form.Group className="mb-3"> {/*email*/}
            <Form.Label htmlFor="email">Email</Form.Label>
            <InputGroup hasValidation>
                <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                <Form.Control
                    type="email"
                    value={email}
                    ref={ref}
                    onChange={(e) => {
                        setEmail(e.target.value)
                    }}
                    isInvalid={!isValidIndicator}
                    isValid={isValidIndicator}
                />
                {props.isValidated &&
                    <Form.Control.Feedback type="invalid">
                        {'Invalid Email'}
                    </Form.Control.Feedback>
                }

            </InputGroup>
            <Form.Text muted>
                You would need to verify this email before you log in.
            </Form.Text>
        </Form.Group>
    )
}

export const PasswordInput = (props: { refVal: ValidatedRef, isValidated?: boolean }) => {
    const [password, setPassword] = useState("")
    const {ref, validate} = {...props.refVal}
    return (
        <Form.Group className="mb-3">
            <Form.Label htmlFor="inputPassword5">Password</Form.Label>
            <Form.Control
                type="password"
                id="inputPassword5"
                aria-describedby="passwordBlock"
                value={password}
                ref={ref}
                onChange={(e) => {
                    setPassword(e.target.value)
                }}
                isInvalid={props.isValidated && password.length > 0 && !validate()}
                isValid={props.isValidated && password.length > 0 && validate()}
            />
            {props.isValidated &&
                <Form.Control.Feedback type="invalid">Your password must be 8-20 characters long, contain letters (upper-case and
                    lower-case) and numbers, and at least 1 special character.</Form.Control.Feedback>
            }
        </Form.Group>
    )
}

export const ConfirmPasswordInput = (props: { refVal: ValidatedRef, passwordRef: RefObject<HTMLInputElement> }) => {
    const [confirmPassword, setConfirmPassword] = useState("")
    const {ref, validate} = {...props.refVal}
    return (
        <Form.Group className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
                type="password"
                aria-describedby="confirmPasswordBlock"
                value={confirmPassword}
                ref={ref}
                onChange={(e) => {
                    setConfirmPassword(e.target.value)
                }}
                isInvalid={confirmPassword.length > 0 && !validate()}
                isValid={confirmPassword.length > 0 && validate()}
            />
            <Form.Control.Feedback type="invalid">Passwords do not match.</Form.Control.Feedback>
        </Form.Group>
    )
}
