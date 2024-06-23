import {
  json,
  LoaderFunctionArgs,
  LinksFunction,
  ActionFunctionArgs,
  redirect,
} from "@remix-run/node";
import BuchItem from "~/components/buchItemDetail";
import {
  Buch,
  buchUrl,
  certificateAgent as agent,
  SessionInfo,
} from "~/util/types";
import fontawesome from "@fortawesome/fontawesome-svg-core/styles.css?url";
import {
  Link,
  useFetcher,
  useLoaderData,
  useNavigate,
  useRouteLoaderData,
} from "@remix-run/react";
import { BookNotFound } from "~/components/bookNotFound";
import fetch from "node-fetch";
import { loader as rootLoader } from "~/root";
import { authenticator } from "~/services/auth.server";
import { sessionStorage } from "~/services/session.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: fontawesome }];
};

export async function action({ params, request }: ActionFunctionArgs) {
  const { id } = params;
  const sessionInfo: SessionInfo = (
    await sessionStorage.getSession(request.headers.get("cookie"))
  ).get(authenticator.sessionKey);
  const accessToken = sessionInfo?.accessToken;

  let response;
  try {
    response = await fetch(`${buchUrl}/rest/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      agent,
    });
    console.log(response);
  } catch (e) {
    return json({ error: "Fehler beim löschen des Buchs" });
  }
  if (response.status !== 204) {
    return json({ error: "Fehler beim löschen des Buchs" });
  }

  redirect("/");
}

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
  const sessionData = useRouteLoaderData<typeof rootLoader>("root");
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const isUser = sessionData?.roles.includes("user");
  const isAdmin = sessionData?.roles.includes("admin");

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Willst du das Buch: "${buch?.titel.titel}" wirklich löschen?`,
    );
    if (confirmDelete) {
      fetcher.submit(null, { method: "DELETE", action: `/search/${id}` });
    }
  };

  return (
    <div className="container">
      {buch ? (
        <div className="container d-flex flex-column align-items-center mt-5 form-control div-bg mb-5">
          <h1>Buchdetails</h1>
          <BuchItem {...buch} />
          <div className="container-fluid d-flex mt-3 mb-3">
            <div className="me-2 w-100">
              {(isUser || isAdmin) && (
                <div className="d-flex mobile-container">
                  <Link
                    to={`/update/${id}`}
                    state={buch}
                    className="btn btn-primary btn-lg btn-stretch me-2 mt-2"
                  >
                    Ändern
                  </Link>
                  {isAdmin && (
                    <button
                      className="btn btn-primary btn-lg mt-2"
                      onClick={handleDelete}
                    >
                      Löschen
                    </button>
                  )}
                </div>
              )}
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
