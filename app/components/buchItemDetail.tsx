import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { Buch } from "~/util/types";

const BuchItem = (buch: Buch) => {
  return (
    <div className="container mt-3">
      <h1>{buch.titel.titel}</h1>
      <p>Untertitel: {buch.titel.untertitel}</p>
      <p>ISBN: {buch.isbn}</p>
      <p>
        Art:{" "}
        {buch.art
          ? `${buch.art[0]}${buch.art.toLowerCase().slice(1)}`
          : "Unbekannt"}
      </p>
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
      <p>Preis: {buch.preis}€</p>
      <p>Rabatt: {Math.round(buch.rabatt * 100_000) / 1_000}%</p>
      <p>Lieferbar: {buch.lieferbar ? "Ja" : "Nein"}</p>
      <p>Datum: {buch.datum?.toString() ?? "Unbekannt"}</p>
      <p>Homepage: {buch.homepage ?? "Unbekannt"}</p>
      <p>
        Schlagwörter:{" "}
        {buch.schlagwoerter?.length === 0
          ? "-Keine-"
          : buch.schlagwoerter
              ?.map((wort) => `${wort[0]}${wort.toLowerCase().slice(1)}`)
              .join(", ")}
      </p>
    </div>
  );
};

export default BuchItem;
