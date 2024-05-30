import Input from "../components/input";
import SliderWithValue from "../components/slider";
import CheckBox from "../components/checkBox";
import Radio from "~/components/radio";
import CustomDatePicker from "~/components/customdatePicker";
import DropDown from "~/components/dropDown";
import { Form } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";
import { json, LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { commitSession, sessionStorage } from "~/services/session.server";
import { Buch } from "~/components/buchItem";


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
 
async function forwardBookData(bookData: Buch) {
  const response = await fetch("http://localhost:3000/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookData),
  });

  if (!response.ok) {
    throw new Error("Failed to forward book data");
  }

  return await response.json();
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  
  const bookData: Buch = {
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
    schlagwoerter: formData.getAll("schlagwoerter") as string[],
    _links: { self: { href: "" } } 
  };
  try {
    const result = await forwardBookData(bookData);
    return json({ message: "Buch erfolgreich angelegt", result });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return json({ message: "Fehler beim Anlegen des Buches", error: errorMessage }, { status: 500 });
  }
}

export default function NewBookPage() {
  return (
    <Form
    //Problem mit der URL
      action="/new"
      method="POST"
      className="container d-flex flex-column align-items-center mt-5 form-control div-bg mb-5"
    >
      <h1>Neues Buch anlegen</h1>
      <Input placeholder="ISBN" />
      <Input placeholder="Titel" />
      <Input placeholder="Homepage" />
      <DropDown
        name="Buchart"
        items={["Druckausgabe", "Kindle"]}
        placeholder="Select Buchart"
      />
      <CustomDatePicker />
      <Input placeholder="Preis" />
      <Input placeholder="Rabatt" />
      <div
        className="container d-flex justify-content-around mt-3"
        style={{ maxWidth: "400px" }}
      >
        <Radio name="lieferbar" />
        <Radio name="nicht lieferbar" />
      </div>
      <SliderWithValue min={1} max={5} text="Rating" />
      <div
        className="container d-flex justify-content-around mt-3"
        style={{ maxWidth: "400px" }}
      >
        <CheckBox text="JavaScript" name="js" />
        <CheckBox text="TypeScript" name="ts" />
      </div>
      <button type="submit" className="btn btn-success btn-lg mt-4">
        Buch anlegen
      </button>
    </Form>
  );
}
