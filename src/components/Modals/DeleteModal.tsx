import React from "react";
import "./Modal.scss";

interface ModalProps {
  show: boolean;
  handleClose: any;
  handleDeleteProfile: any;
}

const DeleteModal = ({
  show,
  handleClose,
  handleDeleteProfile
}: ModalProps) => {
  const modalClass = show ? "modal display-block" : "modal display-none";
  return (
    <div className={modalClass}>
      <section className="modal-main">
        <div className="delete-confirm-message">
          Are you sure you want to delete your profile
        </div>
        <button
          onClick={handleDeleteProfile}
          className="btn delete-confirm-btn"
        >
          Delete
        </button>
        <button
          onClick={() => handleClose("deleteModal")}
          className="btn delete-cancel-btn"
        >
          Cancel
        </button>
      </section>
    </div>
  );
};

export default DeleteModal;
