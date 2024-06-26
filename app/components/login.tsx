import { Link } from "@remix-run/react";

export const Login = () => {
  return (
    <Link to="/login" style={{ color: "white", textDecoration: "none" }}>
      <button type="button" className="btn btn-primary btn-lg h-100">
        Einloggen
      </button>
    </Link>
  );
};
