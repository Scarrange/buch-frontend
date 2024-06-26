import {
  ActionFunctionArgs,
  json,
  LinksFunction,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Alert } from "~/components/alert";
import { GithubLoginButton } from "~/components/gitHubButton";
import { InputLogin } from "~/components/inputLogin";
import { SubmitButton } from "~/components/submitButton";
import { authenticator } from "~/services/auth.server";
import fontawesome from "@fortawesome/fontawesome-svg-core/styles.css?url";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: fontawesome }];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    await authenticator.authenticate("user-pass", request, {
      successRedirect: "/",
      throwOnError: true,
    });
  } catch (error) {
    if (error instanceof Error) {
      return json({ error: error.message });
    }
    throw error;
  }
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });
};

const Login = () => {
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
    <div className="container d-flex flex-column align-items-center mt-5">
      {(error || isLoading) && <Alert message={error} isLoading={isLoading} />}
      <fetcher.Form
        method="POST"
        action="/login"
        className="container d-flex flex-column align-items-center form-control mb-5 pb-5 div-bg"
        style={{ maxWidth: "850px", overflow: "auto" }}
      >
        <h2 className="text-center mt-5">Login</h2>
        <div className="form-group mt-5 w-100">
          <label htmlFor="username" className="form-label">
            Benutzername
          </label>
          <InputLogin
            name="username"
            placeholder="Benutzernamen eingeben"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group mt-4 w-100">
          <label htmlFor="password" className="form-label">
            Passwort
          </label>
          <InputLogin
            name="password"
            placeholder="Passwort eingeben"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <small id="passwordHelp" className="form-text text-muted">
            Teilen sie ihre Daten niemals mit Fremden.
          </small>
        </div>
        <SubmitButton
          text="Anmelden"
          style={{ maxWidth: "360px", width: "100%" }}
          className="mt-2"
        />
        <GithubLoginButton />
      </fetcher.Form>
    </div>
  );
};

export default Login;
