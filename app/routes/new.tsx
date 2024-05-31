import Input from "../components/input";
import SliderWithValue from "../components/slider";
import CheckBox from "../components/checkBox";
import Radio from "~/components/radio";
import CustomDatePicker from "~/components/customdatePicker";
import DropDown from "~/components/dropDown";
import { Form, Link, useActionData } from "@remix-run/react";
import { authenticator, Token } from "~/services/auth.server";
import { json, LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { commitSession, sessionStorage } from "~/services/session.server";
import { Buch } from "~/components/buchItem";

export interface ErrorResponse {
  statusCode: number;
}

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
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

async function forwardBookData(bookData: Omit<Buch, "_links">, token: Token) {
  const response = await fetch("https://localhost:3000/rest", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.accessToken}`,
    },
    body: JSON.stringify(bookData),
  });
  if (response.status !== 201) {
    const res: ErrorResponse = await response.json();
    if (res.statusCode === 401) {
      return {
        statusCode: 401,
      };
    }
    return {
      statusCode: res.statusCode,
    };
  }

  return {
    statusCode: 201,
    location: response.headers.get("Location"),
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  type BookInput = Omit<Buch, "_links">;
  const js = formData.get("javascript") ? "JAVASCRIPT" : null;
  const ts = formData.get("typescript") ? "TYPESCRIPT" : null;

  //https://remix.run/docs/en/main/guides/form-validation Zum Validieren
  const bookData: BookInput = {
    isbn: formData.get("isbn") as string,
    titel: {
      titel: formData.get("titel") as string,
      untertitel: formData.get("untertitel") as string,
    },
    homepage: formData.get("homepage") as string,
    art: formData.get("art") as string,
    datum: formData.get("datum") as string,
    preis: parseFloat(formData.get("preis") as string),
    rabatt: parseFloat(formData.get("rabatt") as string),
    lieferbar: formData.get("lieferbar") === "true",
    rating: parseFloat(formData.get("rating") as string),
    schlagwoerter: [js, ts].filter((e) => e != null),
  };

  console.log(bookData);
  const accessToken: Token = (
    await sessionStorage.getSession(request.headers.get("cookie"))
  ).get(authenticator.sessionKey);

  const result = await forwardBookData(bookData, accessToken);
  if (result.statusCode === 201) {
    const id = result.location?.substring(result.location.lastIndexOf("/") + 1);
    return json({ created: true, id });
  }
  if (result.statusCode === 401) {
    return await authenticator.logout(request, { redirectTo: "/login" });
  }

  return json({
    created: result.statusCode === 201,
  });
}

export default function NewBookPage() {
  const actionData = useActionData<typeof action>();
  const created = actionData?.created;
  const id = actionData?.id;

  return (
    <div className="d-flex flex-column align-items-center mt-5">
      {actionData ? (
        <div
          className={`container alert alert-${created ? "success" : "danger"} d-flex flex-column align-items-center`}
          role="alert"
          style={{ maxWidth: "600px" }}
        >
          {created
            ? "Buch wurde erfolgreich angelegt"
            : "Fehler beim Anlegen des Buches!"}
          {created ? (
            <Link to={`/search/${id}`}>
              <button type="button" className="btn btn-success   mt-4">
                Zum Buch
              </button>
            </Link>
          ) : null}
        </div>
      ) : null}
      <Form
        action="/new"
        method="POST"
        className="container d-flex flex-column align-items-center form-control div-bg mb-5"
      >
        <h1>Neues Buch anlegen</h1>
        <Input name="isbn" placeholder="ISBN" />
        <Input name="titel" placeholder="Titel" />
        <Input name="untertitel" placeholder="Untertitel" />
        <Input name="homepage" placeholder="Homepage" />
        <DropDown
          name="art"
          items={["Druckausgabe", "Kindle"]}
          placeholder="Select Buchart"
        />
        <CustomDatePicker />
        <Input name="preis" placeholder="Preis" />
        <Input name="rabatt" placeholder="Rabatt" />
        <div
          className="container d-flex justify-content-around mt-3"
          style={{ maxWidth: "400px" }}
        >
          <Radio name="lieferbar" />
          <Radio name="nicht lieferbar" />
        </div>
        <SliderWithValue name="rating" min={1} max={5} text="Rating" />
        <div
          className="container d-flex justify-content-around mt-3"
          style={{ maxWidth: "400px" }}
        >
          <CheckBox text="JavaScript" name="javascript" />
          <CheckBox text="TypeScript" name="typescript" />
        </div>
        <button type="submit" className="btn btn-success btn-lg mt-4">
          Buch anlegen
        </button>
      </Form>
    </div>
  );
}
