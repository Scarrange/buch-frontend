import Input from "../components/input";
import CheckBox from "../components/checkBox";
import DropDown from "~/components/dropDown";
import { Form, useActionData } from "@remix-run/react";
import { ActionFunctionArgs, json } from "@remix-run/node";
import BuchItem, { Buch } from "~/components/buchItem";

export async function action({ request }: ActionFunctionArgs) {
  const data = await request.formData();
  const queryParams = getQueryUrl(Array.from(data.entries()));
  const response = await fetch(`https://localhost:3000/rest?${queryParams}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return json({ buecher: await response.json() });
}

function getQueryUrl(entries: [string, FormDataEntryValue][]) {
  let paramStr = "";
  const queryParams = entries.filter(([, value]) => value !== "");
  if (queryParams.length === 0) {
    return paramStr;
  }

  const first = queryParams.splice(0, 1);
  paramStr = paramStr.concat(`${first[0][0]}=${first[0][1]}`);
  queryParams.forEach(
    ([key, value]) => (paramStr = paramStr.concat(`&${key}=${value}`)),
  );
  return paramStr;
}

export default function SearchPage() {
  const data = useActionData<typeof action>();
  const buecher: [] = data?.buecher?._embedded?.buecher;

  //TODO: entscheiden, ob Ergebnis auf anderer Route angezeigt werden soll
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
        <DropDown
          name="art"
          placeholder="Buchart"
          items={["", "Druckausgabe", "Kindle"]}
        />
        <DropDown
          name="rating"
          placeholder="Rating"
          items={["", "1", "2", "3", "4", "5"]}
        />
        <div
          className="container d-flex justify-content-around mt-3"
          style={{ maxWidth: "400px" }}
        >
          <CheckBox text="JavaScript" name="javascript" />
          <CheckBox text="TypeScript" name="typescript" />
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
