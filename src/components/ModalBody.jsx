import React from 'react'

const ModalBody = ({ children, title, targetModal, footer = null, size = null }) => {
    return (
        <div
            className="modal fade"
            id={targetModal}
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
        >
            <div className={`modal-dialog ${size ? 'modal-' + size : ''}`}>
                <div className="modal-content">
                    <div className="modal-header d-flex align-items-center">
                        {title}
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        {children}
                    </div>
                    {footer && (
                        <div className="modal-footer">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}


export default ModalBody