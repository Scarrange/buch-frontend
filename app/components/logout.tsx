import { Link } from "@remix-run/react";

const Logout = (props: { onClick?: () => void }) => {
  return (
    <Link to="/logout" onClick={props.onClick}>
      <button type="button" className="btn btn-primary btn-lg">
        Logout
      </button>
    </Link>
  );
};

export default Logout;
