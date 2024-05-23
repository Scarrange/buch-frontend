import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import GithubLoginButton from "~/components/gitHubButton";
import InputLogin from "~/components/inputLogin";
import SubmitButton from "~/components/submitButton";
import { authenticator } from "~/services/auth.server";

export async function action({ request }: LoaderFunctionArgs) {
  return authenticator.authenticate("user-pass", request, {
    successRedirect: "/",
    failureRedirect: "/login",
  });
}

export async function loader({ request }: ActionFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });
  return null;
}

export default function Login() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="container login-container">
      <h2 className="text-center">Login</h2>
      <Form method="post" action="/login">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="form-group mt-5">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <InputLogin
                name="username"
                placeholder="Enter your Username here"
              />
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="form-group mt-4">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <InputLogin
                name="password"
                placeholder="Enter your Password here"
              />
              <small id="passwordHelp" className="form-text text-muted">
                Please do not share your Password with anyone else.
              </small>
            </div>
          </div>
        </div>
        <SubmitButton
          text="Anmelden"
          style={{ width: "359.28px" }}
          className="mt-2"
        />
      </Form>
      <GithubLoginButton />
      {actionData ? (
        <div className="alert alert-danger mt-3">{actionData}</div>
      ) : null}
    </div>
  );
}
