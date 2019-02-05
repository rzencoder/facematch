import React from 'react';
import './AvatarModal.scss';

interface ModalProps {
    show: boolean,
    handleClose: any,
    children: any
}

const AvatarModal = ({ show, handleClose, children }: ModalProps) => {
    const modalClass = show ? "modal display-block" : "modal display-none";
    return (
        <div className={modalClass}>
            <section className="modal-main">
                <div className="fa fa-times" onClick={handleClose}></div>
                <div className="modal-container">
                    {children}
                </div>
            </section>
        </div>
    );
}

export default AvatarModal;
