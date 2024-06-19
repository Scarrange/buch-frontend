import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { useNavigate, Form, useLocation, useLoaderData, Link, useFetcher } from "@remix-run/react";
import { useState } from "react";
import Alert from "~/components/alert";
import CheckBox from "~/components/checkBoxGivenValue";
import { Buch, BuchInput, ErrorResponse, SessionInfo } from "~/util/types";
import ErrorInfo from "../components/errorInfo";
import { authenticator } from "~/services/auth.server";
import { getBuchInput, validateBookData } from "~/util/functions";

let id: string | undefined;

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const buchDataInput: BuchInput = getBuchInput(formData);
  //TODO Buch validieren und absenden + Request behandeln
  const errors = validateBookData(buchDataInput);
  if (Object.keys(errors).length > 0) {
    return json({ updated: false, id: undefined, message: undefined, errors });
  }

  const sessionInfo: SessionInfo = (
    await sessionStorage.getSession(request.headers.get("cookie"))
  ).get(authenticator.sessionKey);

  const result = await loader(buchDataInput, sessionInfo.accessToken);
  if (result.statusCode === 401) {
    return await authenticator.logout(request, { redirectTo: "/login" });
  }

  return json({
    updated: result.statusCode === 204,
    message: result.message,
    errors,
  });
};

export async function idx({ params }: LoaderFunctionArgs) {
  id  = params.id;
  return id;
}

export async function loader(bookData: BuchInput, token: string) {

  let response;
  try{
  response = await fetch(`https://localhost:3000/rest/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookData),
  });
} catch (e) {
  return { statusCode: 500, message: "Keine Verbindung zum Backend möglich" };
}

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

const Update = () => {
  const navigate = useNavigate();
   const location = useLocation();
   const buchData : Buch = location.state;
  const id = useLoaderData<typeof idx>();
  const fetcher = useFetcher<typeof action>();
  const actionData = fetcher.data;
  const errors = actionData?.errors;
  const updated = actionData?.updated;
  const message = actionData?.message;
  const isLoading = fetcher.state !== "idle";
  const [isMobile, setIsMobile] = useState(false);
  
  const handleButtonClick = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
  if(!buchData){
    return <p>Buch wurde nicht gefunden</p>;
  }

  return (
    <div className="container d-flex flex-column align-items-center mt-5 form-control div-bg mb-5">
      <h1>Buch aktualisieren</h1>

      <div className="container d-flex flex-column align-items-center mt-5">
      {(actionData || isLoading) && (
        <Alert
          isLoading={isLoading}
          success={updated}
          title="Fehler beim Aktualisieren des Buches"
          message={message}
        >
          {
            <Link to={`/update/${id}`}>
              <button type="button" className="btn btn-success   mt-4">
                Zum Buch
              </button>
            </Link>
          }
        </Alert>
      )}
      <Form method="post" className="w-100">
        <div className="mb-3">
          <label htmlFor="isbn" className="form-label">ISBN</label>
          <input type="text" className="form-control mb-3" id="isbn" name="isbn" defaultValue={buchData.isbn} required />
          <ErrorInfo error={errors?.isbn} />

          <label htmlFor="titel" className="form-label">Titel</label>
          <input type="text" className="form-control mb-3" id="titel" name="titel" defaultValue={buchData.titel.titel} required />
          <ErrorInfo error={errors?.titel} />

          <label htmlFor="untertitel" className="form-label">Untertitel</label>
          <input type="text" className="form-control mb-3" id="untertitel" name="untertitel" defaultValue={buchData.titel.untertitel} />
          <ErrorInfo error={errors?.untertitel} />

          <label htmlFor="homepage" className="form-label">Homepage</label>
          <input type="url" className="form-control mb-3" id="homepage" name="homepage" defaultValue={buchData.homepage} />
          <ErrorInfo error={errors?.homepage} />

          <label htmlFor="art" className="form-label">Art</label>
          <select className="form-control" id="art" name="art" defaultValue={buchData.art}>
            <option value="true">DRUCKAUSGABE</option>
            <option value="false">KINDLE</option>
          </select>
          <ErrorInfo error={errors?.art} />

          <label htmlFor="datum" className="form-label">Datum</label>
          <input type="date" className="form-control mb-3" id="datum" name="datum" defaultValue={buchData.datum} />
          <ErrorInfo error={errors?.datum} />

          <label htmlFor="preis" className="form-label">Preis</label>
          <input type="number" className="form-control mb-3" id="preis" name="preis" defaultValue={buchData.preis} step="0.01" />
          <ErrorInfo error={errors?.preis} />

          <label htmlFor="rabatt" className="form-label">Rabatt</label>
          <input type="number" className="form-control mb-3" id="rabatt" name="rabatt" defaultValue={buchData.rabatt} step="0.01" />
          <ErrorInfo error={errors?.rabatt} />

          <label htmlFor="rating" className="form-label">Rating</label>
          <input type="number" className="form-control mb-3" id="rating" name="rating" defaultValue={buchData.rating} step="1" max="5" />
          <ErrorInfo error={errors?.rating} />

          <label htmlFor="lieferbar" className="form-label mb-3">Lieferbar</label>
          <select className="form-control" id="lieferbar" name="lieferbar" defaultValue={buchData.lieferbar.toString()}>
            <option value="true">Ja</option>
            <option value="false">Nein</option>
          </select>
          <ErrorInfo error={errors?.lieferbar} />

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
        <button 
          type="submit" 
          className="btn btn-success btn-lg mt-4"
          onClick={handleButtonClick}
          >
            Speichern
          </button>

        <div className="mobile-container d-flex justify-content-between">
        <button 
          type="button" 
          className="btn btn-secondary btn-lg mt-3" 
          onClick={() => navigate(-1)}
          >
            Abbrechen
          </button>
      </div>
      </Form>
    </div>
    </div>
  );
}

export default Update;