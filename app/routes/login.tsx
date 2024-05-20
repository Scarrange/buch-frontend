import { Form } from "@remix-run/react";


export default function Login() {
  return (
    <div className="container mt-5">
      <h2 className="text-center">Login</h2>
      <Form method="post" action="/login">
        <div className="row justify-content-center"> 
          <div className="col-md-6"> 
            <div className="form-group">
              <label htmlFor="username" className="form-label">Username</label>
              <input type="text" className="form-control" id="username" name="username" placeholder="Enter your Username here" required style={{ width: "632.26px"}} />
            </div>
          </div>
        </div>
        <div className="row justify-content-center"> 
          <div className="col-md-6"> 
            <div className="form-group"> 
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" className="form-control" id="password" name="password" placeholder="Enter your Password here" required style={{ width: "632.26px"}}/>
              <small id="passwordHelp" className="form-text text-muted">Please do not share your Password with anyone else.</small>
            </div>
          </div>
        </div>
        <div className="form-group mt-4 text-center">
          <button type="submit" className="btn custom-btn" style={{ width: "359.28px" }} >Anmelden</button>
        </div>
      </Form>
    </div>
  );
}
