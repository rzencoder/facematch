import React from 'react';
import './AvatarModal.css';

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
                <button onClick={handleClose}>close</button>
                <div className="modal-container">
                    {children}
                </div>
            </section>
        </div>
    );
}

export default AvatarModal;
