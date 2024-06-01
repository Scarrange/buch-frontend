import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useEffect, useState } from "react";
import GithubLoginButton from "~/components/gitHubButton";
import InputLogin from "~/components/inputLogin";
import SubmitButton from "~/components/submitButton";
import { authenticator } from "~/services/auth.server";
import { commitSession, sessionStorage } from "~/services/session.server";

export async function action({ request }: ActionFunctionArgs) {
  const session = await sessionStorage.getSession(
    request.headers.get("cookie"),
  );
  try {
    await authenticator.authenticate("user-pass", request, {
      successRedirect: "/",
      throwOnError: true,
    });
  } catch (error) {
    if (error instanceof Error) {
      session.flash(authenticator.sessionErrorKey, error.message);
      return json(
        { error: error.message },
        { headers: { "Set-Cookie": await commitSession(session) } },
      );
    }
    throw error;
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });
  const session = await sessionStorage.getSession(
    request.headers.get("cookie"),
  );
  const error = session.get(authenticator.sessionErrorKey);
  return json(
    { error },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    },
  );
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (actionData) {
      setUsername("");
      setPassword("");
    }
  }, [actionData]);

  return (
    <div className="d-flex flex-column align-items-center mt-5">
      {actionData ? (
        <div
          className="container alert alert-danger d-flex flex-column align-items-center"
          role="alert"
          style={{ maxWidth: "600px" }}
        >
          {actionData.error}
        </div>
      ) : null}

      <Form
        method="POST"
        action="/login"
        className="container d-flex flex-column align-items-center form-control mb-5 pb-5 div-bg"
        style={{ minWidth: "650px", maxWidth: "850px" }}
      >
        <h2 className="text-center mt-5">Login</h2>
        <div className="form-group mt-5">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <InputLogin
            name="username"
            placeholder="Enter your Username here"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group mt-4">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <InputLogin
            name="password"
            placeholder="Enter your Password here"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <small id="passwordHelp" className="form-text text-muted">
            Please do not share your Password with anyone else.
          </small>
        </div>
        <SubmitButton
          text="Anmelden"
          style={{ width: "360px" }}
          className="mt-2"
        />
        <GithubLoginButton />
      </Form>
    </div>
  );
}
