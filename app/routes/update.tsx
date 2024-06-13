import { ActionFunctionArgs, json } from "@remix-run/node";
import { useActionData, useNavigate, Form } from "@remix-run/react";
import CheckBox from "~/components/checkBoxGivenValue";
import { BuchInput, transformInput } from "~/util/types";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const buchDataInput: BuchInput = transformInput(formData);
  return json({ success: true, buchData: buchDataInput });
}

//Validierung fehlt und die richtige Art von Feld für die Eingaben und Änderungen sind nicht persistent
export default function Update() {
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();

  if (!actionData) {
    return <p>Keine Buchdaten empfangen</p>;
  }

  const { buchData } = actionData;

  return (
    <div className="container d-flex flex-column align-items-center mt-5 form-control div-bg mb-5">
      <h1>Buch aktualisieren</h1>

      <Form method="post" className="w-100">
        <div className="mb-3">
          <label htmlFor="isbn" className="form-label">ISBN</label>
          <input type="text" className="form-control mb-3" id="isbn" name="isbn" defaultValue={buchData.isbn} required />

          <label htmlFor="titel" className="form-label">Titel</label>
          <input type="text" className="form-control mb-3" id="titel" name="titel" defaultValue={buchData.titel.titel} required />

          <label htmlFor="untertitel" className="form-label">Untertitel</label>
          <input type="text" className="form-control mb-3" id="untertitel" name="untertitel" defaultValue={buchData.titel.untertitel} />

          <label htmlFor="homepage" className="form-label">Homepage</label>
          <input type="url" className="form-control mb-3" id="homepage" name="homepage" defaultValue={buchData.homepage} />

          <label htmlFor="art" className="form-label">Art</label>
          <select className="form-control" id="art" name="art" defaultValue={buchData.art}>
            <option value="true">DRUCKAUSGABE</option>
            <option value="false">KINDLE</option>
          </select>

          <label htmlFor="datum" className="form-label">Datum</label>
          <input type="date" className="form-control mb-3" id="datum" name="datum" defaultValue={buchData.datum} />

          <label htmlFor="preis" className="form-label">Preis</label>
          <input type="number" className="form-control mb-3" id="preis" name="preis" defaultValue={buchData.preis} step="0.01" />

          <label htmlFor="rabatt" className="form-label">Rabatt</label>
          <input type="number" className="form-control mb-3" id="rabatt" name="rabatt" defaultValue={buchData.rabatt} step="0.01" />

          <label htmlFor="rating" className="form-label">Rating</label>
          <input type="number" className="form-control mb-3" id="rating" name="rating" defaultValue={buchData.rating} step="1" max="5" />

          <label htmlFor="lieferbar" className="form-label mb-3">Lieferbar</label>
          <select className="form-control" id="lieferbar" name="lieferbar" defaultValue={buchData.lieferbar.toString()}>
            <option value="true">Ja</option>
            <option value="false">Nein</option>
          </select>

          {/* Check ob JavaScript oder Typescript als Schlagwort vorkommt und dementsprechend Checkbox setzen */}
          <label htmlFor="Schlagwörter" className="form-label">Schlagwörter</label>
          <CheckBox text="JavaScript" name="JavaScript" value={false} />
          <CheckBox text="TypeScript" name="TypeScript" value={false}/>

        </div>
        <button type="submit" className="btn btn-primary btn-lg me-2">Speichern</button>
        <button type="button" className="btn btn-secondary btn-lg" onClick={() => navigate(-1)}>Abbrechen</button>
      </Form>
    </div>
  );
}
