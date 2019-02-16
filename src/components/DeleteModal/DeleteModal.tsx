import React from "react";
import "./DeleteModal.scss";

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
        <div>Are you sure you want to delete your profile</div>
        <div onClick={handleDeleteProfile} className="modal-container">
          Delete
        </div>
        <div
          onClick={() => handleClose("deleteModal")}
          className="modal-container"
        >
          Cancel
        </div>
      </section>
    </div>
  );
};

export default DeleteModal;
