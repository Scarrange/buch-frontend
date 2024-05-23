import { ActionFunctionArgs, redirect, json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { ClientOnly } from "remix-utils/client-only";
import ErrorModal from "~/components/errorModal.client";
import GithubLoginButton from "~/components/gitHubButton";
import InputLogin from "~/components/inputLogin";
import SubmitButton from "~/components/submitButton";

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const payload = {
    username: body.get("username"),
    password: body.get("password"),
  };

  const response = await fetch("https://localhost:3000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (response.status !== 200) {
    return json({ status: response.status });
  }
  return redirect("/");
}

export default function Login() {
  const error = useActionData<typeof action>();

  return (
    <div className="container login-container">
      {error ? <ClientOnly>{() => <ErrorModal />}</ClientOnly> : null}
      <h2 className="text-center">Login</h2>
      <Form method="post" action="/login">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="form-group mt-5">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <InputLogin placeholder = "Enter your Username here"
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
              <InputLogin placeholder = "Enter your Password here" />
              <small id="passwordHelp" className="form-text text-muted">
                Please do not share your Password with anyone else.
              </small>
            </div>
          </div>
        </div>
        <SubmitButton
          text="Anmelden"
          style={{ width: '359.28px' }}
          className="mt-2"
          />
      </Form>
      <GithubLoginButton/>
    </div>
  );
}
