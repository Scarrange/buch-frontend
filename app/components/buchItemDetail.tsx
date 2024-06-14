import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { Buch } from "~/util/types";

const BuchItem = (buch: Buch) => {
  return (
    <div className="container mt-5" style={{ borderRadius: "12%" }}>
      <h1>{buch.titel.titel}</h1>
      <p>{buch.titel.untertitel}</p>
      <p>ISBN: {buch.isbn}</p>
      <p>Art: {buch.art}</p>
      <p>
        Rating:{" "}
        {Array.from({ length: 5 }).map((_, index) => (
          <FontAwesomeIcon
            key={index}
            icon={index < buch.rating ? faStar : faStarRegular}
            style={{
              color: index < buch.rating ? "gold" : "black",
            }}
          />
        ))}
      </p>
      <p>Preis: {buch.preis}</p>
      <p>Rabatt: {buch.rabatt}</p>
      <p>Lieferbar: {buch.lieferbar}</p>
      <p>Datum: {buch.datum?.toString()}</p>
      <p>Homepage: {buch.homepage}</p>
      <p>
        Schlagwörter:{" "}
        {buch.schlagwoerter?.map((wort) => wort.toLowerCase()).join(", ")}
      </p>
    </div>
  );
};

export default BuchItem;
