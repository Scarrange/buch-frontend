import Input from "../components/input";
import CheckBox from "../components/checkBox";
import DropDown from "~/components/dropDown";
import { Form, useActionData } from "@remix-run/react";
import { ActionFunctionArgs, json } from "@remix-run/node";
import BuchItem, { Buch } from "~/components/buch";

export async function action({ request }: ActionFunctionArgs) {
  console.log("action");
  const data = request.formData();
  const response = await fetch("https://localhost:3000/rest?", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return json({ buecher: await response.json() });
}

export default function SearchPage() {
  const data = useActionData<typeof action>();
  const buecher: [] = data?.buecher?._embedded?.buecher;

  return (
    <div className="container-fluid d-flex">
      <Form
        action="/search"
        method="POST"
        className="container d-flex flex-column align-items-center mt-5 form-control div-bg mb-5"
      >
        <h1>Suchformular</h1>
        <Input placeholder="ISBN" />
        <Input placeholder="Titel" />
        <Input placeholder="Homepage" />
        <DropDown name="Buchart" items={["", "Druckausgabe", "Kindle"]} />
        <DropDown name="Rating" items={["", "1", "2", "3", "4", "5"]} />
        <div
          className="container d-flex justify-content-around mt-3"
          style={{ maxWidth: "400px" }}
        >
          <CheckBox text="JavaScript" name="js" />
          <CheckBox text="TypeScript" name="ts" />
        </div>
        <button type="submit" className="btn btn-success btn-lg mt-4">
          Suchen
        </button>
      </Form>
      <div className="d-flex flex-column align-items-center">
        {buecher?.map((buch: Buch, index: number) => (
          <BuchItem key={index} {...buch} />
        ))}
      </div>
    </div>
  );
}
