import React, {useContext} from 'react';
import './index.scss';
import {LoginSignupForm} from '../../components/Forms/LoginSignUp';
import {UserIDContext} from "../../contexts/UserID";
import {Button, Container, Form} from 'react-bootstrap';

function User() {
    const UserID = useContext(UserIDContext)
    return (
        <>
            {
                UserID.uid ? //if not logged not show form else this
                    <div id={'user-container'}>
                        <Container>
                            <Form>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control type="email" placeholder="Enter email" />
                                    <Form.Text className="text-muted">
                                        We'll never share your email with anyone else.
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password" />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                    <Form.Check type="checkbox" label="Check me out" />
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    Submit
                                </Button>
                            </Form>
                        </Container>


                    </div>
                    :
                    <LoginSignupForm/>
            }

        </>
    );
}

export default User;

