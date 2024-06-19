import { json, LoaderFunctionArgs, LinksFunction } from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigate } from "@remix-run/react";
import BuchItem from "~/components/buchItemDetail";
import { Buch } from "~/util/types";
import fontawesome from "@fortawesome/fontawesome-svg-core/styles.css?url";

let id: string | undefined

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: fontawesome }];
};

export async function loader({ params }: LoaderFunctionArgs) {

  id = params.id;

  const response = await fetch(`https://localhost:3000/rest/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
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
      <div className="container d-flex flex-column align-items-center mt-5 form-control div-bg mb-5">
        <h1>Buchdetails</h1>
        {buch ? <BuchItem {...buch} /> : <p>Buch nicht gefunden</p>}
        <div className="container-fluid d-flex mt-3 mb-3">
          <div>
            {/* Form, das die Buchdaten an die Update-Route sendet */}
            <Form method="post" action={`/update/${id}`}>
              <input type="hidden" name="titel" value={buch?.titel.titel} />
              <input
                type="hidden"
                name="untertitel"
                value={buch?.titel.untertitel}
              />
              <input type="hidden" name="isbn" value={buch?.isbn} />
              <input type="hidden" name="art" value={buch?.art} />
              <input type="hidden" name="rating" value={buch?.rating} />
              <input
                type="hidden"
                name="lieferbar"
                value={buch?.lieferbar.toString()}
              />
              <input type="hidden" name="homepage" value={buch?.homepage} />
              <input
                type="hidden"
                name="schlagwoerter"
                value={buch?.schlagwoerter?.join(",")}
              />
              <input type="hidden" name="link" value={buch?._links.self.href} />
              <button type="submit" className="btn btn-primary btn-lg me-2 mt-2">
                Ändern
              </button>
              <Link to="/test">
                <button className="btn btn-primary btn-lg mt-2">Löschen</button>
              </Link>
            </Form>
          </div>
          <button
            className="btn btn-secondary btn-lg ms-auto mt-2"
            onClick={() => navigate(-1)}
          >
            Zurück
          </button>
        </div>
      </div>
    </div>
  );
}
