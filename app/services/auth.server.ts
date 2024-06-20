import { Authenticator, AuthorizationError } from "remix-auth";
import { sessionStorage } from "~/services/session.server";
import { FormStrategy } from "remix-auth-form";
import jwt from "jsonwebtoken";
import {
  ApiResponse,
  DecodedJwtToken,
  SessionInfo,
  certificateAgent as agent,
  buchUrl,
} from "~/util/types";
import fetch from "node-fetch";

export const authenticator = new Authenticator<SessionInfo>(sessionStorage, {
  sessionErrorKey: "authError",
  throwOnError: true,
});

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const username = form.get("username");
    const password = form.get("password");

    let response;
    try {
      response = await fetch(`${buchUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        agent,
        body: JSON.stringify({ username, password }),
      });
    } catch (error) {
      console.log("Login fehlgeschlagen");
      throw new AuthorizationError("Login fehlgeschlagen");
    }
    if (response?.status !== 200) {
      console.log("Login fehlgeschlagen");
      throw new AuthorizationError("Login fehlgeschlagen");
    }

    const data = (await response.json()) as ApiResponse;
    const accessToken = data.access_token?.toString();
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
