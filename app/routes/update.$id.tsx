import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  LinksFunction,
  redirect,
} from "@remix-run/node";
import { useNavigate, useLocation, useFetcher } from "@remix-run/react";
import { Alert } from "~/components/alert";
import { CheckBox } from "../components/checkBox";
import {
  BuchInput,
  SessionInfo,
  certificateAgent as agent,
  buchUrl,
  BuchMitVersion,
  ErrorResponse,
} from "~/util/types";
import { ErrorInfo } from "../components/errorInfo";
import { authenticator } from "~/services/auth.server";
import { getBuchInput, validateBookData } from "~/util/functions";
import { sessionStorage } from "~/services/session.server";
import { Dropdown } from "~/components/dropDown";
import { Input } from "../components/input";
import datepickerStyles from "react-datepicker/dist/react-datepicker.css?url";
import fetch from "node-fetch";
import { CustomDatePicker } from "~/components/customdatePicker";
import classNames from "classnames";
import { Radio } from "~/components/radio";
import { SliderWithValue } from "~/components/slider";
import { useEffect, useState } from "react";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: datepickerStyles }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
};

const updateBook = async (
  buch: BuchInput,
  id: string,
  version: string,
  token: string,
) => {
  let response;
  try {
    response = await fetch(`${buchUrl}/rest/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "If-Match": `"${version}"`,
      },
      agent,
      body: JSON.stringify(buch),
    });
  } catch (e) {
    return { statusCode: 500, message: "Keine Verbindung zum Backend möglich" };
  }

  if (response.status === 204) {
    return { statusCode: 204, message: undefined };
  }

  const res = (await response.json()) as ErrorResponse;
  return {
    statusCode: res.statusCode,
    message: res.message,
  };
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { id } = params;
  if (!id) {
    return redirect("/search");
  }

  const formData = await request.formData();
  const buchDataInput: BuchInput = getBuchInput(formData);
  const version = String(formData.get("version"));
  const errors = validateBookData(buchDataInput);
  if (Object.keys(errors).length > 0) {
    return json({ updated: false, message: undefined, errors });
  }

  const sessionInfo: SessionInfo = (
    await sessionStorage.getSession(request.headers.get("cookie"))
  ).get(authenticator.sessionKey);

  const result = await updateBook(
    buchDataInput,
    id,
    version,
    sessionInfo.accessToken,
  );
  if (result.statusCode === 204) {
    return redirect(`/search/${id}`);
  }

  if (result.statusCode === 401) {
    return await authenticator.logout(request, { redirectTo: "/login" });
  }

  return json({
    updated: false,
    message: result.message,
    errors,
  });
};

const Update = () => {
  const fetcher = useFetcher<typeof action>();
  const navigate = useNavigate();
  const location = useLocation();
  const buchData = location.state as { buch: BuchMitVersion };
  const buch = buchData?.buch;
  const actionData = fetcher.data;
  const errors = actionData?.errors;
  const updated = actionData?.updated;
  const message = actionData?.message;
  const isLoading = fetcher.state !== "idle";
  const [isMobile, setIsMobile] = useState(false);
  const hasJs = buch?.schlagwoerter?.includes("JAVASCRIPT");
  const hasTs = buch?.schlagwoerter?.includes("TYPESCRIPT");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 950);
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleButtonClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!buch) {
    return null;
  }

  return (
    <div className="container d-flex flex-column align-items-center mt-5">
      {(actionData || isLoading) && (
        <Alert
          isLoading={isLoading}
          success={updated}
          title="Fehler beim Aktualisieren des Buches"
          message={message}
        />
      )}
      <fetcher.Form
        method="PUT"
        className="container d-flex flex-column align-items-center form-control div-bg mb-5"
      >
        <h1>Buch aktualisieren</h1>
        <Input
          name="titel"
          placeholder="Titel"
          defaultValue={buch.titel.titel}
          disabled
        />
        <Input
          name="untertitel"
          placeholder="Untertitel"
          defaultValue={buch.titel.untertitel}
          disabled
        />
        <Input
          name="isbn"
          placeholder="ISBN"
          defaultValue={buch.isbn}
          required
        />
        <ErrorInfo error={errors?.isbn} />
        <Input
          name="homepage"
          placeholder="Homepage"
          defaultValue={buch.homepage ?? undefined}
        />
        <ErrorInfo error={errors?.homepage} />
        <Dropdown
          name="art"
          items={["", "Druckausgabe", "Kindle"]}
          placeholder="Buchart"
          selected={buch.art ?? undefined}
        />
        <ErrorInfo error={errors?.art} />
        <CustomDatePicker defaultValue={buch.datum ?? undefined} />
        <ErrorInfo error={errors?.datum} />
        <Input
          name="preis"
          placeholder="Preis"
          defaultValue={buch.preis}
          required
        />
        <ErrorInfo error={errors?.preis} />
        <Input
          name="rabatt"
          placeholder="Rabatt"
          defaultValue={buch.rabatt}
          required
        />
        <ErrorInfo error={errors?.rabatt} />
        <div
          className={classNames(
            "container",
            "d-flex",
            "justify-content-around",
            "mt-3",
            "mobile-container",
          )}
          style={{ maxWidth: "400px" }}
        >
          <Radio name="lieferbar" checked={buch.lieferbar} />
          <Radio name="nicht lieferbar" checked={!buch.lieferbar} />
        </div>
        <ErrorInfo error={errors?.lieferbar} />
        {isMobile ? (
          <Dropdown
            name="rating"
            placeholder="Rating"
            items={["1", "2", "3", "4", "5"]}
            selected={buch.rating}
          />
        ) : (
          <SliderWithValue
            name="rating"
            min={0}
            max={5}
            defaultValue={buch.rating}
            text="Rating"
          />
        )}
        <ErrorInfo error={errors?.rating} />
        <div
          className="container d-flex justify-content-around mt-3 mobile-container"
          style={{ maxWidth: "400px" }}
        >
          <CheckBox text="JavaScript" name="javascript" checked={hasJs} />
          <CheckBox text="TypeScript" name="typescript" checked={hasTs} />
        </div>
        <input type="hidden" name="version" value={buch.version ?? 0} />
        <div className="container mobile-container d-flex justify-content-around mt-4">
          <button
            type="submit"
            className="btn btn-success btn-lg"
            onClick={handleButtonClick}
          >
            Speichern
          </button>
          <button
            type="button"
            className={classNames("btn", "btn-secondary", "btn-lg", {
              "mt-2": isMobile,
            })}
            onClick={() => navigate(-1)}
          >
            Abbrechen
          </button>
        </div>
      </fetcher.Form>
    </div>
  );
};

export default Update;
