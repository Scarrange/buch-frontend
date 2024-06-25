import { ActionFunctionArgs, json, LoaderFunctionArgs, LinksFunction } from "@remix-run/node";
import { useNavigate, useLocation, Link, useFetcher, useParams, useLoaderData } from "@remix-run/react";
import Alert from "~/components/alert";
import CheckBox from "../components/checkBox";
import { BuchInput, ErrorResponse, SessionInfo, certificateAgent as agent} from "~/util/types";
import ErrorInfo from "../components/errorInfo";
import { authenticator } from "~/services/auth.server";
import { getBuchInput, validateBookData } from "~/util/functions";
import { sessionStorage } from "~/services/session.server";
import DropDown from '~/components/dropDown';
import Input from "../components/input";
import datepickerStyles from "react-datepicker/dist/react-datepicker.css?url";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: datepickerStyles }];
};

let idLokal: number | undefined;

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.id !== undefined) {
    idLokal = parseInt(params.id) | 1;
  }
  return idLokal;
}

export async function updateBook(bookData: BuchInput, token: string) {
  let response;
  console.log("updateBook "+idLokal)
  try {
    response = await fetch(`https://localhost:3000/rest/${idLokal}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        'If-Match': `"${0}"`
      },
      agent,
      body: JSON.stringify(bookData),
    });
    console.log(response);
  } catch (e) {
    console.log(e)
    return { statusCode: 500, message: "Keine Verbindung zum Backend möglich" + e };
  }

  if (response.status === 204) {
    return {
      statusCode: 204,
    };
  }

  const res: ErrorResponse = await response.json();
  return {
    statusCode: res.statusCode,
    message: res.message,
  };
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const buchDataInput: BuchInput = getBuchInput(formData);
  const errors = validateBookData(buchDataInput);
  if (Object.keys(errors).length > 0) {
    return json({ updated: false, id: undefined, message: undefined, errors });
  }

  const sessionInfo: SessionInfo = (
    await sessionStorage.getSession(request.headers.get("cookie"))
  ).get(authenticator.sessionKey);

  const result = await updateBook(buchDataInput, sessionInfo.accessToken);
  if (result.statusCode === 401) {
    return await authenticator.logout(request, { redirectTo: "/login" });
  }
  return json({
    updated: result.statusCode === 204,
    message: result.message,
    errors,
  });
};

const Update = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { buch, id } = location.state;
  const fetcher = useFetcher<typeof action>();
  const actionData = fetcher.data;
  const errors = actionData?.errors;
  const updated = actionData?.updated;
  const message = actionData?.message;
  const isLoading = fetcher.state !== "idle";

  idLokal = id;
  console.log(id)

  const handleButtonClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  if (!buch) {
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
                <button type="button" className="btn btn-success mt-4">
                  Zum Buch
                </button>
              </Link>
            }
          </Alert>
        )}
        <fetcher.Form method="PUT" action={`/update/${id}`} className="w-100">
          <div className="mb-3">
            <label htmlFor="isbn" className="form-label">
              ISBN
            </label>
            <Input
              name="isbn"
              placeholder="ISBN"
              defaultValue={buch.isbn}
              required
            />
            <ErrorInfo error={errors?.isbn} />

            <label htmlFor="titel" className="form-label">
              Titel
            </label>
            <Input
              name="titel"
              placeholder="Titel"
              defaultValue={buch.titel.titel}
              required
            />
            <ErrorInfo error={errors?.titel} />

            <label htmlFor="untertitel" className="form-label">
              Untertitel
            </label>
            <Input
              name="untertitel"
              placeholder="Titel"
              defaultValue={buch.titel.untertitel}
            />
            <ErrorInfo error={errors?.untertitel} />

            <label htmlFor="homepage" className="form-label">
              Homepage
            </label>
            <Input
              name="homepage"
              placeholder="Titel"
              defaultValue={buch.homepage}
            />
            <ErrorInfo error={errors?.homepage} />

            <label htmlFor="art" className="form-label">
              Art
            </label>
            <DropDown
                name="art"
                items={["", "Druckausgabe", "Kindle"]}
                placeholder="Select Buchart"
              />
            <ErrorInfo error={errors?.art} />

            <label htmlFor="datum" className="form-label">
              Datum
            </label>
            <Input
              name="datum"
              placeholder="Datum"
              defaultValue={buch.datum}
            />
            <ErrorInfo error={errors?.datum} />

            <label htmlFor="preis" className="form-label">
              Preis
            </label>
            <Input
              name="preis"
              placeholder="Preis"
              defaultValue={buch.preis}
            />
            <ErrorInfo error={errors?.preis} />

            <label htmlFor="rabatt" className="form-label">
              Rabatt
            </label>
            <Input
              name="rabatt"
              placeholder="Rabatt"
              defaultValue={buch.rabatt}
            />
            <ErrorInfo error={errors?.rabatt} />

            <label htmlFor="rating" className="form-label">
              Rating
            </label>
            <Input
              name="rating"
              placeholder="Rating"
              defaultValue={buch.rating}
            />
            <ErrorInfo error={errors?.rating} />

            <label htmlFor="lieferbar" className="form-label mb-3">
              Lieferbar
            </label>
            <select
              className="form-control"
              id="lieferbar"
              name="lieferbar"
              defaultValue={buch.lieferbar.toString()}
            >
              <option value="true">Ja</option>
              <option value="false">Nein</option>
            </select>
            <ErrorInfo error={errors?.lieferbar} />

            <label htmlFor="Schlagwörter" className="form-label">
              Schlagwörter
            </label>
            <div
          className="form-label"
          style={{ maxWidth: "400px" }}
          >
          <CheckBox text="JavaScript" name="javascript" />
          <CheckBox text="TypeScript" name="typescript" />
          </div>
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
        </fetcher.Form>
      </div>
    </div>
  );
};

export default Update;