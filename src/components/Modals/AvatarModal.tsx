import React from "react";
import "./Modal.scss";

interface ModalProps {
  show: boolean;
  handleClose: any;
  children: any;
}

const AvatarModal = ({ show, handleClose, children }: ModalProps) => {
  const modalClass = show ? "modal display-block" : "modal display-none";
  return (
    <div className={modalClass}>
      <section className="modal-main">
        <div className="close-btn" onClick={() => handleClose("avatarModal")} />
        <div className="modal-container">{children}</div>
      </section>
    </div>
  );
};

export default AvatarModal;
