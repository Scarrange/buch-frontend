import { json, LoaderFunctionArgs, LinksFunction } from "@remix-run/node";
import BuchItem from "~/components/buchItemDetail";
import { Buch, buchUrl, certificateAgent as agent } from "~/util/types";
import fontawesome from "@fortawesome/fontawesome-svg-core/styles.css?url";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { BookNotFound } from "~/components/bookNotFound";
import fetch from "node-fetch";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: fontawesome }];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  let response;

  try {
    response = await fetch(`${buchUrl}/rest/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      agent,
    });
  } catch (e) {
    return json({ buch: null, id });
  }

  if (response.status !== 200) {
    return json({ buch: null, id });
  }

  const buch = (await response.json()) as Buch;
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
            <div className="me-2 w-100">
              <div className="d-flex mobile-container">
                <Link
                  to={`/update/${id}`}
                  state={buch}
                  className="btn btn-primary btn-lg btn-stretch me-2 mt-2"
                >
                  Ändern
                </Link>
                <Link to="/test" className="btn btn-primary btn-lg mt-2">
                  Löschen
                </Link>
              </div>
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
        <BookNotFound id={id ?? "No ID"} />
      )}
    </div>
  );
}
