import { Link } from "@remix-run/react";
import { Buch } from "~/util/types";

const getId = (link: string) => {
  return link.substring(link.lastIndexOf("/") + 1);
};

const BuchItem = (buch: Buch) => {
  return (
    <div
      className="container d-flex flex-column align-items-start mt-5 form-control div-bg mb-5"
      style={{ borderRadius: "12%" }}
    >
      <h1>{buch.titel?.titel}</h1>
      <p>{buch.titel?.untertitel}</p>
      <p>ISBN: {buch.isbn}</p>
      <p>Art: {buch.art}</p>
      <p>Rating: {buch.rating}</p>
      <p>Lieferbar: {buch.lieferbar ? "true" : "false"}</p>
      <p>Homepage: {buch.homepage}</p>
      <p>
        Schlagwörter:{" "}
        {buch.schlagwoerter?.map((wort) => wort.toLowerCase()).join(", ")}
      </p>
      <Link
        to={`/search/${getId(buch._links.self.href)}`}
        className="btn btn-primary"
      >
        Details
      </Link>
    </div>
  );
};

export default BuchItem;
