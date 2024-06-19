import { LoaderFunctionArgs } from "@remix-run/node";
import { useNavigate, Form, useLocation, useLoaderData } from "@remix-run/react";
import CheckBox from "~/components/checkBoxGivenValue";
import { Buch } from "~/util/types";

export const action = () => {
  //TODO Buch validieren und absenden + Request behandeln
  return null;
};

export const loader = ({ params }: LoaderFunctionArgs) => 
{
  const { id } = params;
  return id;
}

const Update = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const buchData : Buch = location.state;
  const id = useLoaderData<typeof loader>();

  if(!buchData){
    return <p>Buch wurde nicht gefunden</p>;
  }

  return (
    <div className="container">
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

          <label htmlFor="Schlagwörter" className="form-label">Schlagwörter</label>
          {buchData.schlagwoerter?.
            filter(wort => wort !== "JAVASCRIPT" && wort !== "TYPESCRIPT").
            map((wort) => (
            <CheckBox key={wort} text={wort} name={wort} checked={true} />
            ))}
          {/* //TODO Util function für includes(Javascript) */}
          <CheckBox text="JavaScript" name="JavaScript" checked={buchData.schlagwoerter?.includes("JAVASCRIPT") ? true : false} />
          <CheckBox text="TypeScript" name="TypeScript" checked={buchData.schlagwoerter?.includes("TYPESCRIPT") ? true : false}/>

        </div>
        <div className="mobile-container d-flex justify-content-between">
        <button type="submit" className="btn btn-success btn-lg mt-3">Speichern</button>
        <button type="button" className="btn btn-secondary btn-lg mt-3" onClick={() => navigate(-1)}>Abbrechen</button>
      </div>
      </Form>
    </div>
    </div>
  );
}

export default Update;