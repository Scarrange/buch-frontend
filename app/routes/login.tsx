import {
  ActionFunctionArgs,
  json,
  LinksFunction,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import Alert from "~/components/alert";
import GithubLoginButton from "~/components/gitHubButton";
import InputLogin from "~/components/inputLogin";
import SubmitButton from "~/components/submitButton";
import { authenticator } from "~/services/auth.server";
import { commitSession, sessionStorage } from "~/services/session.server";
import fontawesome from "@fortawesome/fontawesome-svg-core/styles.css?url";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: fontawesome }];
};

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
  const fetcher = useFetcher<typeof action>();
  const actionData = fetcher.data;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const isLoading = fetcher.state !== "idle";

  useEffect(() => {
    if (actionData) {
      setUsername("");
      setPassword("");
      setError(actionData.error || "");
    }
  }, [actionData]);

  useEffect(() => {
    if (username || password) {
      setError("");
    }
  }, [username, password]);

  return (
    <div className="d-flex flex-column align-items-center mt-5">
      {(error || isLoading) && <Alert message={error} isLoading={isLoading} />}
      <fetcher.Form
        method="POST"
        action="/login"
        className="container d-flex flex-column align-items-center form-control mb-5 pb-5 div-bg"
        style={{ maxWidth: "850px", overflow: "auto"}}
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
      </fetcher.Form>
    </div>
  );
}
