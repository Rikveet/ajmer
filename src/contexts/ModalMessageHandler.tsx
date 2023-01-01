import React, {createContext, ReactNode, useState} from "react";
import ModalMessage from "../components/ModalMessage";

export const ModalMessageContext = createContext((message: string, title?: string, AdditionalContent?: ReactNode) => {})
export const ModalMessageProvider = (props: { children: ReactNode }) => {
    const [message, _setMessage] = useState('');
    const [title, _setTitle] = useState('Alert')
    const [AdditionalContent, setAdditionalContent] = useState<ReactNode>(<></>)
    return (
        <ModalMessageContext.Provider value={(message: string, title?: string, AdditionalContent?: ReactNode) => {
            _setMessage(message);
            if (title)
                _setTitle(title)
            if(AdditionalContent)
                setAdditionalContent(AdditionalContent)
        }}>
            {message.length > 0 &&
                <ModalMessage
                    title={title}
                    message={message}
                    AdditionalContent={AdditionalContent}
                    close={() => {
                        _setMessage('')
                        _setTitle('Alert')
                    }}/>
            }
            {props.children}
        </ModalMessageContext.Provider>
    )
}
