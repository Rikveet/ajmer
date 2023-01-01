import React, {useContext} from 'react';
import './index.scss';
import {LoginSignupForm} from '../../components/Forms/LoginSignUp';
import {UserIDContext} from "../../contexts/UserID";

function User() {
    const UserID = useContext(UserIDContext)
    return (
        <>
            {
                UserID.uid ? //if not logged not show form else this
                    <div id={'user-container'}>
                        <img src={'https://thumbs.gfycat.com/JitteryOffensiveHartebeest-size_restricted.gif'}/>
                    </div>
                    :
                    <LoginSignupForm/>
            }

        </>
    );
}

export default User;

