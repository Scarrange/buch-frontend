import { Link } from "@remix-run/react";

const Logout = () => {
  return (
    <Link to="/logout">
      <button type="button" className="btn btn-primary btn-lg">
        Logout
      </button>
    </Link>
  );
};

export default Logout;
