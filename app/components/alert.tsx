const Alert = (props: {
  isLoading?: boolean;
  success?: boolean | undefined;
  message: string | undefined;
  children?: React.ReactNode;
  title?: string;
  style?: string;
}) => {
  return (
    <div
      className={`container alert alert-${props.isLoading ? "secondary" : props.success ? "success" : "danger"} d-flex flex-column align-items-center ${props.style}`}
      role="alert"
      style={{ maxWidth: "600px" }}
    >
      {props.isLoading ? (
        <div className="spinner-border" role="status"></div>
      ) : props.success ? (
        "Buch wurde erfolgreich angelegt"
      ) : (
        <div>
          {props.title && <p>{props.title}</p>}
          {props.message}
        </div>
      )}
      {props.success && props.children}
    </div>
  );
};

export default Alert;
