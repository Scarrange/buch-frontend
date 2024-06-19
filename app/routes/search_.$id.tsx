import { json, LoaderFunctionArgs, LinksFunction } from "@remix-run/node";
import BuchItem from "~/components/buchItemDetail";
import { Buch } from "~/util/types";
import fontawesome from "@fortawesome/fontawesome-svg-core/styles.css?url";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: fontawesome }];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  let response;

  try {
    response = await fetch(`https://localhost:3000/rest/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (e) {
    return json({ buch: null, id });
  }

  if (response.status !== 200) {
    return json({ buch: null, id });
  }

  const buch: Buch = await response.json();
  return json({ buch, id });
}

export default function BookDetailPage() {
  const { buch, id } = useLoaderData<typeof loader>();
  const navigate = useNavigate();


  return (
    <div className="container">
      {buch ? (
        <div className="container d-flex flex-column align-items-center mt-5 form-control div-bg mb-5">
          <h1>Buchdetails</h1>
          <BuchItem {...buch} />
          <div className="container-fluid d-flex mt-3 mb-3">
            <div>
              <Link to={`/update/${id}`} state={buch}>
                <button className="btn btn-primary btn-lg me-2 mt-2">
                  Ändern
                </button>
              </Link>
              <Link to="/test">
                <button className="btn btn-primary btn-lg mt-2">Löschen</button>
              </Link>
            </div>
            <button
              className="btn btn-secondary btn-lg ms-auto mt-2"
              onClick={() => navigate(-1)}
            >
              Zurück
            </button>
          </div>
        </div>
      ) : (
        <p>Buch nicht gefunden</p>
      )}
    </div>
  );
}
