import Input from "../components/input";
import SliderWithValue from "../components/slider";
import CheckBox from "../components/checkBox";
import Radio from "~/components/radio";
import CustomDatePicker from "~/components/customdatePicker";
import DropDown from "~/components/dropDown";
import { Form } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { commitSession, sessionStorage } from "~/services/session.server";

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

export default function NewBookPage() {
  return (
    <Form
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
