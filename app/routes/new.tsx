import Input from "../components/input";
import SliderWithValue from "../components/slider";
import CheckBox from "../components/checkBox";
import Radio from "~/components/radio";
import CustomDatePicker from "~/components/customdatePicker";
import DropDown from "~/components/dropDown";
import { Link, useFetcher } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";
import {
  json,
  LoaderFunctionArgs,
  ActionFunctionArgs,
  LinksFunction,
} from "@remix-run/node";
import { commitSession, sessionStorage } from "~/services/session.server";
import ErrorInfo from "../components/errorInfo";
import Alert from "~/components/alert";
import { BuchInput, ErrorResponse, SessionInfo } from "~/util/types";
import datepickerStyles from "react-datepicker/dist/react-datepicker.css?url";
import { getBuchInput, validateBookData } from "../util/functions";
import { useEffect, useState } from "react";
import classNames from "classnames";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: datepickerStyles }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const session = await sessionStorage.getSession(
    request.headers.get("cookie"),
  );
  const error = session.get(authenticator.sessionErrorKey);
  return json(
    { error },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    },
  );
};

const forwardBookData = async (bookData: BuchInput, token: string) => {
  let response;
  try {
    response = await fetch("https://localhost:3000/rest", {
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
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const buchDataInput: BuchInput = getBuchInput(formData);
  const errors = validateBookData(buchDataInput);
  if (Object.keys(errors).length > 0) {
    return json({ created: false, id: undefined, message: undefined, errors });
  }

  const sessionInfo: SessionInfo = (
    await sessionStorage.getSession(request.headers.get("cookie"))
  ).get(authenticator.sessionKey);

  const result = await forwardBookData(buchDataInput, sessionInfo.accessToken);
  if (result.statusCode === 401) {
    return await authenticator.logout(request, { redirectTo: "/login" });
  }

  return json({
    created: result.statusCode === 201,
    id: result.location?.substring(result.location.lastIndexOf("/") + 1),
    message: result.message,
    errors,
  });
};

const NewBookPage = () => {
  const fetcher = useFetcher<typeof action>();
  const actionData = fetcher.data;
  const errors = actionData?.errors;
  const created = actionData?.created;
  const id = actionData?.id;
  const message = actionData?.message;
  const isLoading = fetcher.state !== "idle";
  const [isMobile, setIsMobile] = useState(false);

  const handleButtonClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  return (
    <div className="container d-flex flex-column align-items-center mt-5">
      {(actionData || isLoading) && (
        <Alert
          isLoading={isLoading}
          success={created}
          title="Fehler beim Anlegen des Buches"
          message={message}
        >
          {
            <Link to={`/search/${id}`}>
              <button type="button" className="btn btn-success mt-4">
                Zum Buch
              </button>
            </Link>
          }
        </Alert>
      )}
      <fetcher.Form
        method="POST"
        className="container d-flex flex-column align-items-center form-control div-bg mb-5"
      >
        <h1>Neues Buch anlegen</h1>
        <Input name="isbn" placeholder="ISBN" required />
        <ErrorInfo error={errors?.isbn} />
        <Input name="titel" placeholder="Titel" required />
        <ErrorInfo error={errors?.titel} />
        <Input name="untertitel" placeholder="Untertitel" />
        <ErrorInfo error={errors?.untertitel} />
        <Input name="homepage" placeholder="Homepage" />
        <ErrorInfo error={errors?.homepage} />
        <DropDown
          name="art"
          items={["", "Druckausgabe", "Kindle"]}
          placeholder="Select Buchart"
        />
        <ErrorInfo error={errors?.art} />
        <CustomDatePicker />
        <ErrorInfo error={errors?.datum} />
        <Input name="preis" placeholder="Preis" required />
        <ErrorInfo error={errors?.preis} />
        <Input name="rabatt" placeholder="Rabatt" required />
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
          <Radio name="lieferbar" />
          <Radio name="nicht lieferbar" />
        </div>
        <ErrorInfo error={errors?.lieferbar} />
        {isMobile ? (
          <DropDown
            name="rating"
            placeholder="Rating"
            items={["1", "2", "3", "4", "5"]}
          />
        ) : (
          <SliderWithValue name="rating" min={0} max={5} text="Rating" />
        )}
        <ErrorInfo error={errors?.rating} />
        <div
          className="container d-flex justify-content-around mt-3 mobile-container"
          style={{ maxWidth: "400px" }}
        >
          <CheckBox text="JavaScript" name="javascript" />
          <CheckBox text="TypeScript" name="typescript" />
        </div>
        <button
          type="submit"
          className="btn btn-success btn-lg mt-4"
          onClick={handleButtonClick}
        >
          Buch anlegen
        </button>
      </fetcher.Form>
    </div>
  );
};

export default NewBookPage;
