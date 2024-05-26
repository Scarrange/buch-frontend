import Input from "../components/input";
import CheckBox from "../components/checkBox";
import DropDown from "~/components/dropDown";
import { Form, useActionData } from "@remix-run/react";
import { ActionFunctionArgs, json } from "@remix-run/node";
import BuchItem, { Buch } from "~/components/buchItem";

export async function action({ request }: ActionFunctionArgs) {
  const data = await request.formData();
  const queryParams = getQueryUrl(data.entries());
  const response = await fetch(`https://localhost:3000/rest?${queryParams}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return json({ buecher: await response.json() });
}

function getQueryUrl(entries: IterableIterator<[string, FormDataEntryValue]>) {
  Array.from(entries).forEach(([key, value]) => console.log(key, value));
}

export default function SearchPage() {
  const data = useActionData<typeof action>();
  const buecher: [] = data?.buecher?._embedded?.buecher;

  return (
    <div className="container d-flex">
      <Form
        action="/search"
        method="POST"
        className="container d-flex flex-column align-items-center mt-5 form-control div-bg mb-5"
        style={{ overflow: "auto", maxHeight: "500px" }}
      >
        <h1>Suchformular</h1>
        <Input name="isbn" placeholder="ISBN" />
        <Input name="titel" placeholder="Titel" />
        <Input name="homepage" placeholder="Homepage" />
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
