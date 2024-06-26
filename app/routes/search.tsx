import { Input } from "../components/input";
import { CheckBox } from "../components/checkBox";
import { Dropdown } from "~/components/dropDown";
import { Form, useLoaderData } from "@remix-run/react";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { BuchItem } from "~/components/buchItem";
import { Alert } from "~/components/alert";
import {
  ApiResponse,
  Buch,
  buchUrl,
  certificateAgent as agent,
} from "~/util/types";
import { useEffect, useState } from "react";
import classNames from "classnames";
import fetch from "node-fetch";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const queryParams = url.searchParams;

  if (!queryParams.size) {
    return json({ buecher: null, message: null });
  }

  const paramString = getQueryUrl(Array.from(queryParams.entries()));
  try {
    const response = await fetch(`${buchUrl}/rest?${paramString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      agent,
    });

    const data = (await response.json()) as ApiResponse;
    const buecher = data._embedded?.buecher;
    if (!buecher || buecher.length === 0) {
      return json({
        buecher: [],
        message: "Keine Bücher mit den gewünschten Suchkriterien gefunden.",
      });
    }
    return json({ buecher: buecher, message: null });
  } catch (error) {
    return json({
      buecher: null,
      message:
        "Es besteht keine Verbindung zum Server. Bitte versuchen Sie es später nochmal.",
    });
  }
};

const getQueryUrl = (entries: [string, FormDataEntryValue][]) => {
  let paramStr = "";
  const queryParams = entries.filter(([, value]) => value !== "");
  if (queryParams.length === 0) {
    return paramStr;
  }

  const first = queryParams.splice(0, 1);
  paramStr = paramStr.concat(`${first[0][0]}=${first[0][1]}`);
  queryParams.forEach(
    ([key, value]) => (paramStr = paramStr.concat(`&${key}=${value}`)),
  );
  return paramStr;
};

const SearchPage = () => {
  const { buecher, message } = useLoaderData<{
    buecher: Buch[] | null;
    message: string | null;
  }>();
  const [hasContent, setHasContent] = useState(false);

  useEffect(() => {
    setHasContent(buecher != null || message != null);
  }, [buecher, message]);

  return (
    <div className="container d-flex mobile-container">
      <Form
        id="searchForm"
        method="GET"
        className={classNames(
          "container",
          "d-flex",
          "flex-column",
          "align-items-center",
          "mt-5",
          "form-control",
          "div-bg",
          "sticky-form",
          { "mb-5": !hasContent },
        )}
        style={{
          overflow: "auto",
          maxHeight: "520px",
        }}
      >
        <h1>Suchformular</h1>
        <Input name="isbn" placeholder="ISBN" />
        <Input name="titel" placeholder="Titel" />
        <Input name="homepage" placeholder="Homepage" />
        <Dropdown
          name="art"
          placeholder="Buchart"
          items={["", "Druckausgabe", "Kindle"]}
        />
        <Dropdown
          name="rating"
          placeholder="Rating"
          items={["", "0", "1", "2", "3", "4", "5"]}
        />
        <div
          className="container d-flex justify-content-around mt-3 mobile-container"
          style={{ maxWidth: "400px" }}
        >
          <CheckBox text="JavaScript" name="javascript" />
          <CheckBox text="TypeScript" name="typescript" />
        </div>
        <button type="submit" className="btn btn-success btn-lg mt-4">
          Suchen
        </button>
      </Form>
      <div
        className="d-flex flex-column align-items-center mb-5"
        style={{ flex: hasContent ? "auto" : "0" }}
      >
        {message && (
          <Alert message={message} classNames={"center-message mt-5"} />
        )}
        <div className="d-flex flex-column align-items-center">
          {buecher?.map((buch: Buch, index: number) => (
            <BuchItem key={index} {...buch} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
