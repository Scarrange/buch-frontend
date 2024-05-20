import { Link } from "@remix-run/react";

const login = () => {
  const buttonStyle = {
    backgroundColor: 'white',
    border: '2px solid red',
    color: 'red',
    padding: '10px 20px',
    fontSize: '18px',
    cursor: 'pointer',
    borderRadius: '4px'
  };

  return (
    <Link to="/login" style={{ color: "white", textDecoration: "none" }}>
      <button type="button" className="btn btn-primary" style={buttonStyle}>
        Login
      </button>
    </Link>
  );
};

export default login;
