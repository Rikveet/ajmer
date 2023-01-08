import React, {createContext, ReactNode, useState} from "react";
import ModalMessage, {CloseButtonCustomizationT} from "../components/ModalMessage";

export const ModalMessageContext = createContext((message: string, title?: string, AdditionalContent?: ReactNode, closeButtonCustomization?: CloseButtonCustomizationT) => {
})
export const ModalMessageProvider = (props: { children: ReactNode }) => {
    const [message, _setMessage] = useState('');
    const [title, _setTitle] = useState('Alert')
    const [AdditionalContent, setAdditionalContent] = useState<ReactNode>(<></>)
    const [closeButtonCustomization, setCloseButtonCustomization] = useState<CloseButtonCustomizationT | undefined>( undefined)
    return (
        <ModalMessageContext.Provider value={
            (message: string,
             title?: string,
             AdditionalContent?: ReactNode,
             closeButtonCustomization?: CloseButtonCustomizationT) => {
                _setMessage(message);
                if (title)
                    _setTitle(title)
                if (AdditionalContent)
                    setAdditionalContent(AdditionalContent)
                if (closeButtonCustomization)
                    setCloseButtonCustomization(closeButtonCustomization)
            }}>
            {message.length > 0 &&
                <ModalMessage
                    title={title}
                    message={message}
                    AdditionalContent={AdditionalContent}
                    closeButtonCustomization={closeButtonCustomization}
                    close={() => {
                        _setMessage('')
                        _setTitle('Alert')
                        if(AdditionalContent){
                            setAdditionalContent(<></>)
                        }
                        if(closeButtonCustomization){
                            setCloseButtonCustomization(undefined)
                        }
                    }}/>
            }
            {props.children}
        </ModalMessageContext.Provider>
    )
}
