import React, { useState, useEffect } from "react";
import { Link, Form, useLoaderData } from "@remix-run/react";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import Input from "../components/input";
import CheckBox from "../components/checkBox";
import DropDown from "~/components/dropDown";
import BuchItem, { Buch } from "~/components/buchItem";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const queryParams = url.searchParams;

  if (!queryParams.size) {
    return json({ buecher: null, message: null });
  }

  const paramString = getQueryUrl(Array.from(queryParams.entries()));
  try {
    const response = await fetch(`https://localhost:3000/rest?${paramString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (!data?._embedded?.buecher || data._embedded.buecher.length === 0) {
      return json({
        buecher: [],
        message: `Keine Bücher mit den gewünschten Suchkriterien gefunden.`,
      });
    }
    return json({ buecher: data?._embedded?.buecher, message: null });
  } catch (error) {
    return json({
      buecher: null,
      message:
        "Es besteht keine Verbindung zum Server. Bitte versuchen Sie es später nochmal.",
    });
  }
}

function getQueryUrl(entries: [string, FormDataEntryValue][]) {
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
}

export default function SearchPage() {
  const { buecher, message } = useLoaderData<typeof loader>();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 950);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 950);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className={`container d-flex flex-column ${buecher && buecher.length > 0 ? 'flex-lg-row' : 'justify-content-center align-items-center'}`}
      style={{
        marginTop: "20px",
        marginBottom: "20px",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <Form
        action="/search"
        method="GET"
        className={`container d-flex flex-column align-items-center mt-5 form-control div-bg mb-5 ${buecher && buecher.length > 0 ? '' : 'd-lg-block mx-auto'}`}
        style={{
          overflow: "auto",
          maxHeight: "500px",
          flex: "1",
          position: isMobile ? "relative" : "sticky",
          top: isMobile ? "auto" : "20px",
        }}
      >
        <h1>Suchformular</h1>
        <Input name="isbn" placeholder="ISBN" />
        <Input name="titel" placeholder="Titel" />
        <Input name="homepage" placeholder="Homepage" />
        <DropDown
          name="art"
          placeholder="Buchart"
          items={["", "Druckausgabe", "Kindle"]}
        />
        <DropDown
          name="rating"
          placeholder="Rating"
          items={["", "0", "1", "2", "3", "4", "5"]}
        />
        <div
          className="container d-flex justify-content-around mt-3"
          style={{ maxWidth: "400px" }}
        >
          <CheckBox text="JavaScript" name="javascript" />
          <CheckBox text="TypeScript" name="typescript" />
        </div>
        <button type="submit" className="btn btn-success btn-lg mt-4">
          Suchen
        </button>
      </Form>
      {buecher && buecher.length > 0 && (
        <div
          className="d-flex flex-column align-items-center"
          style={{
            flex: "2",
            marginTop: isMobile ? "20px" : "0",
            marginLeft: isMobile ? "0" : "20px",
          }}
        >
          {message && (
            <div className="alert alert-danger center-message mt-5">
              {<p>{message}</p>}
            </div>
          )}
          {buecher?.map((buch: Buch, index: number) => (
            <BuchItem key={index} {...buch} />
          ))}
        </div>
      )}
    </div>
  );
}
