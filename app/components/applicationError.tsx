import { Link } from "@remix-run/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceSadCry } from "@fortawesome/free-regular-svg-icons";

export const ApplicationError = () => {
  return (
    <div className="container">
      <div className="container d-flex flex-column align-items-center div-bg mt-5 mb-5">
        <FontAwesomeIcon icon={faFaceSadCry} size="3x" className="mb-3" />
        <p>
          <strong>Irgendetwas ist leider schief gelaufen</strong>
        </p>
        <Link to="/" className="btn btn-primary btn-lg btn-stretch me-2 mt-2">
          Home
        </Link>
      </div>
    </div>
  );
};
