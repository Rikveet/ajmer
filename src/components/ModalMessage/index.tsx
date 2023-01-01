import React, {ReactNode, useEffect, useState} from 'react';
import './index.scss';
function ModalMessage(props: {
    title: string,
    message: string,
    close: Function,
    AdditionalContent?: ReactNode
    customInput?: {
        customInputFields: ReactNode,
        customButtonCallBack: Function
    }
}) {
    const {title, message, close, AdditionalContent, customInput} = {...props}
    const [errorCss, setErrorCss] = useState({'display': 'none'});
    const [errorClass, setErrorClass] = useState('modal fade');
    useEffect(() => {
        setTimeout(() => {
            setErrorClass('modal fade show');
            setErrorCss({'display': 'block'})
        }, 200);
    }, []);
    const _close = () => {
        setErrorClass('modal fade');
        setErrorCss({'display': 'none'})
        close()
    }


    return (
        <div className={errorClass}
             id="modal"
             tabIndex={-1}
             style={errorCss}
             aria-modal="true"
             role="dialog"
        >
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalCenterTitle">{title}</h5>
                        <button type="button"
                                className="btn"
                                data-dismiss="modal"
                                aria-label="Close"
                                onClick={_close}>
                            <i className="bi bi-x-square"></i>
                        </button>
                    </div>
                    <div className="modal-body">
                        {message}
                    </div>
                    {AdditionalContent}
                    <div className="modal-footer">
                        <button type="button"
                                className="btn btn-secondary"
                                data-dismiss="modal"
                                onClick={_close}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalMessage;
