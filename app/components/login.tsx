import { Link } from "@remix-run/react";

const login = () => {
  return (
    <Link to="/login" style={{ color: "white", textDecoration: "none" }}>
      <button type="button" className="btn btn-primary">
        Login
      </button>
    </Link>
  );
};

export default login;
