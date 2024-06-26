import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

const GithubLoginButton: React.FC = () => {
  return (
    <div className="d-flex justify-content-center  mt-5 mb-3">
      <button
        className="btn btn-outline-secondary d-flex align-items-center"
        type="button"
      >
        <FontAwesomeIcon icon={faGithub} className="me-2" size="2x" />
        <span className="smaller-text">Mit Github anmelden</span>
      </button>
    </div>
  );
};

export default GithubLoginButton;
