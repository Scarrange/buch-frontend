import { Form } from "@remix-run/react";

export default function Login() {
  return (
    <div className="container mt-5">
      <h2 className="text-center">Login</h2>
      <Form method="post" action="/login">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                placeholder="Enter your Username here"
                required
                style={{ width: "632.26px" }}
              />
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="Enter your Password here"
                required
                style={{ width: "632.26px" }}
              />
              <small id="passwordHelp" className="form-text text-muted">
                Please do not share your Password with anyone else.
              </small>
            </div>
          </div>
        </div>
        <div className="form-group mt-4 text-center">
          <button
            type="submit"
            className="btn custom-btn"
            style={{ width: "359.28px" }}
          >
            Anmelden
          </button>
        </div>
      </Form>
      <div className="d-flex justify-content-center mt-5 mb-3">
        <button className="btn btn-outline-secondary" type="button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          fill="black"
          className="bi bi-github me-2"
          viewBox="0 0 16 16"
          data-darkreader-inline-fill=""
        >
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"></path>
        </svg>
        <span className="smaller-text">Sign up with Github</span>
        </button>
      </div>
    </div>
  );
}
