import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import BuchItem from "~/components/buchItemDetail";
import { Buch } from "~/util/types";

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;

  //TODO Maybe sollte man das Buch übergeben anstatt neu zu fetchen
  const response = await fetch(`https://localhost:3000/rest/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    return json({ buch: null });
  }

  const buch: Buch = await response.json();
  return json({ buch });
}

export default function BookDetailPage() {
  const { buch } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <div className="container d-flex flex-column align-items-center mt-5 form-control div-bg mb-5">
      <h1>Buchdetails</h1>
      {buch ? <BuchItem {...buch} /> : <p>Buch nicht gefunden</p>}
      <div className="container-fluid d-flex mt-3 mb-3">
        <div>
          <Link to="/test">
            <button className="btn btn-primary btn-lg me-2">Ändern</button>
          </Link>
          <Link to="/test">
            <button className="btn btn-primary btn-lg">Löschen</button>
          </Link>
        </div>
        <button
          className="btn btn-primary btn-lg ms-auto"
          onClick={() => navigate(-1)}
        >
          Zurück
        </button>
      </div>
    </div>
  );
}
