import { Authenticator } from "remix-auth";
import { sessionStorage } from "~/services/session.server";
import { FormStrategy } from "remix-auth-form";

export const authenticator = new Authenticator<Token>(sessionStorage, {
    sessionKey: "accessToken",
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
            throw new Error("Login fehlgeschlagen");
        }
        console.log("Login erfolgreich");
        const accessToken = (await response.json()).access_token?.toString();
        return accessToken;
    }),
    "user-pass",
);

type Token = {
    accessToken: string;
};
