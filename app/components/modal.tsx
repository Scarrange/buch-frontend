const CustomConfirmModal = (props: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  return (
    <div className="custom-confirm-modal d-flex align-items-center">
      <div
        className="container div-bg"
        style={{ width: "auto", overflow: "auto", fontSize: "18px" }}
      >
        <p>{props.message}</p>
        <div className="container d-flex mobile-container justify-content-center mt-1">
          <button
            className="btn btn-primary btn-lg me-2 btn-stretch mt-2"
            onClick={props.onConfirm}
          >
            Löschen
          </button>
          <button
            className="btn btn-secondary btn-lg mt-2"
            onClick={props.onCancel}
          >
            abbrechen
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomConfirmModal;
