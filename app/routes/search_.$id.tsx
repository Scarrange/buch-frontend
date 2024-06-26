import {
  json,
  LoaderFunctionArgs,
  LinksFunction,
  ActionFunctionArgs,
  redirect,
} from "@remix-run/node";
import { BuchItem } from "~/components/buchItemDetail";
import {
  buchUrl,
  certificateAgent as agent,
  SessionInfo,
  BuchMitVersion,
} from "~/util/types";
import fontawesome from "@fortawesome/fontawesome-svg-core/styles.css?url";
import {
  Link,
  useActionData,
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
import { CustomConfirmModal } from "~/components/modal";
import { useState } from "react";
import { Alert } from "~/components/alert";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: fontawesome }];
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
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
  } catch (e) {
    return json({ error: "Keine Verbindung zum Backend möglich" });
  }

  if (response.status === 401) {
    return await authenticator.logout(request, { redirectTo: "/login" });
  }

  if (response.status === 204) {
    return redirect("/search");
  }

  return json({ error: "Fehler beim löschen des Buchs" });
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
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

  const versionStr = response.headers.get("etag") ?? "0";
  const version = Number.parseInt(versionStr.slice(1, -1), 10);
  const buch = (await response.json()) as BuchMitVersion;
  buch.version = version;

  return json({ buch, id });
};

const BookDetailPage = () => {
  const { buch, id } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const sessionData = useRouteLoaderData<typeof rootLoader>("root");
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const isUser = sessionData?.roles.includes("user");
  const isAdmin = sessionData?.roles.includes("admin");
  const isLoading = fetcher.state !== "idle";
  const [showModal, setShowModal] = useState(false);

  const confirmDelete = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetcher.submit(null, { method: "DELETE", action: `/search/${id}` });
    setShowModal(false);
  };

  return (
    <div className="container mt-5">
      {(actionData || isLoading) && (
        <Alert message={actionData?.error || ""} isLoading={isLoading} />
      )}
      {buch ? (
        <div className="container d-flex flex-column align-items-center mts-5 form-control div-bg mb-5">
          <h1>Buchdetails</h1>
          <BuchItem {...buch} />
          <div className="container-fluid d-flex mt-3 mb-3">
            <div className="me-2 w-100">
              {(isUser || isAdmin) && (
                <div className="d-flex mobile-container">
                  <Link
                    to={`/update/${id}`}
                    state={{ buch, id }}
                    className="btn btn-primary btn-lg btn-stretch me-2 mt-2"
                  >
                    Ändern
                  </Link>
                  {isAdmin && (
                    <button
                      className="btn btn-primary btn-lg mt-2"
                      onClick={() => setShowModal(true)}
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
          {showModal && (
            <CustomConfirmModal
              message={`Möchtest du das Buch: "${buch?.titel.titel}" wirklich löschen?`}
              onConfirm={confirmDelete}
              onCancel={() => setShowModal(false)}
            />
          )}
        </div>
      ) : (
        <BookNotFound id={id ?? "No ID"} />
      )}
    </div>
  );
};

export default BookDetailPage;
