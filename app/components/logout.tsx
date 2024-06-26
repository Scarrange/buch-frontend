import { Link } from "@remix-run/react";

export const Logout = (props: { onClick?: () => void }) => {
  return (
    <Link to="/logout" onClick={props.onClick}>
      <button type="button" className="btn btn-primary btn-lg h-100">
        Ausloggen
      </button>
    </Link>
  );
};
