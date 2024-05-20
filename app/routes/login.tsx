import { Form } from "@remix-run/react";

export default function Login() {
  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <Form method="post" action="/login">
        <div className="form-group">
          <label htmlFor="benutzername">Benutzername</label>
          <input type="text" className="form-control" id="benutzername" name="benutzernam" placeholder="Benutzernamen eingeben" required />
        </div>
        <div className="form-group">
          <label htmlFor="passwort">Passwort</label>
          <input type="passwort" className="form-control" id="passwort" name="passwort" placeholder="Passwort eingeben" required />
          <small id="passwordHelp" className="form-text text-muted">Wir werden Sie niemals nach ihrem Passwort fragen</small>
        </div>
        <div style={{ height: '20px' }}></div>
        <div className="form-group mt-4 d-grid gap-2 col-6 mx-auto">
          <button type="submit" className="btn btn-primary">Login</button>
        </div>
      </Form>
    </div>
  );
}