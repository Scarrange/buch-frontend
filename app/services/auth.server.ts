import { Authenticator, AuthorizationError } from "remix-auth";
import { sessionStorage } from "~/services/session.server";
import { FormStrategy } from "remix-auth-form";
import jwt from "jsonwebtoken";
import { DecodedJwtToken, SessionInfo } from "~/util/types";

export const authenticator = new Authenticator<SessionInfo>(sessionStorage, {
  sessionErrorKey: "authError",
  throwOnError: true,
});

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const username = form.get("username");
    const password = form.get("password");

    const response = await fetch("https://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response?.status !== 200) {
      console.log("Login fehlgeschlagen");
      throw new AuthorizationError("Login fehlgeschlagen");
    }

    const data = await response.json();
    const accessToken: string = data?.access_token.toString();
    if (!accessToken) {
      throw new AuthorizationError("Login fehlgeschlagen");
    }

    const tokenDecoded = jwt.decode(accessToken);
    const roles = (tokenDecoded as DecodedJwtToken).resource_access[
      "buch-client"
    ].roles;
    if (!roles.length) {
      throw new AuthorizationError("Login fehlgeschlagen"); 
    }

    console.log("Login erfolgreich");
    return {
      accessToken,
      roles,
    };
  }),
  "user-pass",
);
