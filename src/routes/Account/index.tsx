import React, {useContext, useEffect, useState} from 'react';
import './index.scss';
import {LoginSignupForm} from '../../components/Forms/LoginSignUpForm';
import {UserIDContext} from "../../contexts/UserID";
import UserAboutForm from "../../components/Forms/UserAboutForm";
import {ButtonGroup, Dropdown, DropdownButton} from 'react-bootstrap';
import {useLocalStoredState} from "../../customHooks";
import {AnimatePresence} from 'framer-motion';
import {FadeInOut} from '../../components/motions';
import {get, UserInfoConverter, UserInfoT} from "../../components/Database";

function Account() {
    const userID = useContext(UserIDContext)
    const [userInfoOnServer, setUserInfoOnServer] = useState<UserInfoT | undefined>(undefined);
    const [readingUserDataFromServer, setReadingUserDataFromServer] = useState(false);
    const fetchData = async () => {
        if (userID) {
            const result = await get({collection: 'users', segments: [userID]}, new UserInfoConverter())
            if (result.res && result.data) {
                setUserInfoOnServer(result.data as UserInfoT)
            }
        } else {
            console.info('Did not load user info from server because user id is null')
        }
    }
    useEffect(() => {
        fetchData().then(()=>{
            setReadingUserDataFromServer(false)
        })
    }, [userID])

    const links = [
        {
            text: "Account Info",
            link: 'info',
            route: <UserAboutForm userInfoOnServer={userInfoOnServer} setUserInfoOnServer={(info)=>{setUserInfoOnServer(info)}} readingDataFromServer={readingUserDataFromServer}/>
        },
        {
            text: 'Add Listing',
            link: 'addListing',
            route: <div>Under Development</div>
        },
        {
            text: 'Saved Listings',
            link: 'savedListings',
            route: <div>Under Development</div>
        },
    ]
    const [userRoute, setUserRoute] = useLocalStoredState('user-route', 'info', links.map(linkInfo => linkInfo.link))

    return (
        <>
            {
                userID ? //if not logged not show form else this
                    <div id={'user-container'}>
                        <div id={'user-div'}>
                            <DropdownButton as={ButtonGroup} title={links.find(linkInfo => linkInfo.link === userRoute)!.text} id="bg-nested-dropdown">
                                {
                                    links.map(linkInfo =>
                                        <Dropdown.Item key={linkInfo.link}
                                                       onClick={() => {
                                                           setUserRoute(linkInfo.link)
                                                       }}>
                                            {linkInfo.text}
                                        </Dropdown.Item>)
                                }
                            </DropdownButton>
                            <AnimatePresence>
                                <FadeInOut id={userRoute}>
                                    {links.find(linkInfo => linkInfo.link === userRoute)!.route}
                                </FadeInOut>
                            </AnimatePresence>
                        </div>
                    </div>
                    :
                    <LoginSignupForm/>
            }

        </>
    );
}

export default Account;

