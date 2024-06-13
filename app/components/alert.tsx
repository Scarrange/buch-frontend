import { CSSProperties } from "react";

const Alert = (props: {
  isLoading?: boolean;
  success?: boolean | undefined;
  message: string | undefined;
  children?: React.ReactNode;
  title?: string;
  classNames?: string;
  style?: CSSProperties;
}) => {
  return (
    <div
      className={`container alert alert-${props.isLoading ? "secondary" : props.success ? "success" : "danger"} d-flex flex-column align-items-center ${props.classNames}`}
      role="alert"
      style={{ maxWidth: "600px" }}
      // style={props.style}
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
//TODO default exports in named ändern
export default Alert;
