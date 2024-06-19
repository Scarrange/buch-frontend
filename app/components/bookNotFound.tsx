import { Link } from "@remix-run/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceSadCry } from "@fortawesome/free-regular-svg-icons";

export const BookNotFound = (props: { id: string }) => {
  return (
    <div className="container d-flex flex-column div-bg mt-5 mb-5">
      <FontAwesomeIcon icon={faFaceSadCry} size="3x" className="mb-3" />
      <p>
        <strong>{`Das Buch mit der ID: ${props.id} konnte leider nicht gefunden werden.`}</strong>
      </p>
      <div className="d-flex mobile-container justify-content-center align-items-center">
        <div className="d-flex mobile-container">
          <Link to="/" className="btn btn-primary btn-lg btn-stretch me-2 mt-2">
            Home
          </Link>
          <Link to="/search" className="btn btn-primary btn-lg mt-2">
            Zur Suche
          </Link>
        </div>
      </div>
    </div>
  );
};
