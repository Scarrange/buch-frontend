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
import ErrorInfo from "../components/errorInfo";

export interface ErrorResponse {
  statusCode: number;
  message: string;
}
type BuchError = {
  isbn?: string;
  titel?: string;
  untertitel?: string;
  rating?: string;
  art?: string;
  preis?: string;
  rabatt?: string;
  lieferbar?: string;
  datum?: string;
  homepage?: string;
};
type BuchInput = Omit<Buch, "_links">;

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

async function forwardBookData(bookData: BuchInput, token: Token) {
  const response = await fetch("https://localhost:3000/rest", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.accessToken}`,
    },
    body: JSON.stringify(bookData),
  });

  if (response.status === 201) {
    return {
      statusCode: 201,
      location: response.headers.get("Location"),
    };
  }

  const res: ErrorResponse = await response.json();
  return {
    statusCode: res.statusCode,
    message: res.message,
  };
}

function validateBookData(bookData: BuchInput) {
  const errors: BuchError = {};

  if (bookData.isbn.length !== 17) {
    errors.isbn = "ISBN muss 13 Ziffern beinhalten";
  }

  if (
    !bookData.titel?.titel ||
    !bookData.titel.titel?.match("^\\w.*") ||
    bookData.titel.titel?.length > 40
  ) {
    errors.titel = "Der Titel muss zwischen 1 und 40 Zeichen lang sein";
  }

  if (bookData.titel?.untertitel && bookData.titel?.untertitel?.length > 40) {
    errors.untertitel = "Der Untertitel darf maximal 40 Zeichen lang sein";
  }

  if (
    bookData.rating === undefined ||
    bookData.rating < 0 ||
    bookData.rating > 5
  ) {
    errors.rating = "Rating muss zwischen 0 und 5 liegen";
  }

  if (!["", "KINDLE", "DRUCKAUSGABE"].includes(bookData.art ?? "")) {
    errors.art = "Buchart ist ungültig";
  }

  if (!bookData.preis || bookData.preis <= 0) {
    errors.preis = "Preis muss größer 0 sein";
  }

  if (
    bookData.rabatt === undefined ||
    bookData.rabatt < 0 ||
    bookData.rabatt > 1
  ) {
    errors.rabatt = "Rabatt muss zwischen 0 und 1 liegen";
  }

  if (bookData.lieferbar === undefined) {
    errors.lieferbar = "Lieferbarkeit muss angegeben werden";
  }

  if (bookData.datum && !bookData.datum.match("^[0-9]{4}-[0-9]{2}-[0-9]{2}$")) {
    errors.datum = "Datum muss dem Format yyyy/mm/dd entsprechen";
  }

  if (bookData.homepage && !bookData.homepage.includes(".")) {
    errors.homepage = "Homepage muss eine URL sein";
  }

  return errors;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const js = formData.get("javascript") ? "JAVASCRIPT" : null;
  const ts = formData.get("typescript") ? "TYPESCRIPT" : null;

  const buchDataInput: BuchInput = {
    isbn: String(formData.get("isbn")),
    titel: {
      titel: String(formData.get("titel")),
      untertitel: String(formData.get("untertitel")) || undefined,
    },
    homepage: String(formData.get("homepage")) || undefined,
    art: String(formData.get("art")) || undefined,
    datum: String(formData.get("datum")) || undefined,
    preis: parseFloat(String(formData.get("preis"))),
    rabatt: parseFloat(String(formData.get("rabatt"))),
    lieferbar: formData.get("lieferbar") === "true",
    rating: parseFloat(String(formData.get("rating"))),
    schlagwoerter: [js, ts].filter((e) => e != null),
  };

  console.log(buchDataInput);
  const errors = validateBookData(buchDataInput);
  if (Object.keys(errors).length > 0) {
    return json({ created: false, id: undefined, message: undefined, errors });
  }

  const accessToken: Token = (
    await sessionStorage.getSession(request.headers.get("cookie"))
  ).get(authenticator.sessionKey);

  const result = await forwardBookData(buchDataInput, accessToken);
  if (result.statusCode === 401) {
    return await authenticator.logout(request, { redirectTo: "/login" });
  }

  return json({
    created: result.statusCode === 201,
    id: result.location?.substring(result.location.lastIndexOf("/") + 1),
    message: result.message,
    errors,
  });
}

export default function NewBookPage() {
  const actionData = useActionData<typeof action>();
  const errors = actionData?.errors;
  const created = actionData?.created;
  const id = actionData?.id;
  const message = actionData?.message;

  return (
    <div className="d-flex flex-column align-items-center mt-5">
      {actionData ? (
        <div
          className={`container alert alert-${created ? "success" : "danger"} d-flex flex-column align-items-center`}
          role="alert"
          style={{ maxWidth: "600px" }}
        >
          {created ? (
            "Buch wurde erfolgreich angelegt"
          ) : (
            <div>
              <p>Fehler beim Anlegen des Buches!</p>
              {message}
            </div>
          )}
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
        <Input name="isbn" placeholder="ISBN" required />
        <ErrorInfo error={errors?.isbn} />
        <Input name="titel" placeholder="Titel" required />
        <ErrorInfo error={errors?.titel} />
        <Input name="untertitel" placeholder="Untertitel" />
        <ErrorInfo error={errors?.untertitel} />
        <Input name="homepage" placeholder="Homepage" />
        <ErrorInfo error={errors?.homepage} />
        <DropDown
          name="art"
          items={["", "Druckausgabe", "Kindle"]}
          placeholder="Select Buchart"
        />
        <ErrorInfo error={errors?.art} />
        <CustomDatePicker />
        <ErrorInfo error={errors?.datum} />
        <Input name="preis" placeholder="Preis" required />
        <ErrorInfo error={errors?.preis} />
        <Input name="rabatt" placeholder="Rabatt" required />
        <ErrorInfo error={errors?.rabatt} />
        <div
          className="container d-flex justify-content-around mt-3"
          style={{ maxWidth: "400px" }}
        >
          <Radio name="lieferbar" />
          <Radio name="nicht lieferbar" />
        </div>
        <ErrorInfo error={errors?.lieferbar} />
        <SliderWithValue name="rating" min={0} max={5} text="Rating" />
        <ErrorInfo error={errors?.rating} />
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
