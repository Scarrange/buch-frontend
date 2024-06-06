import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";

//ist provisorisch, da der Code nur eine Copy von buchItem.tsx ist, und vllt Dubletten verhindert werden können.
// Hauptgrund für die Datei ist das Entfernen des Detials-Buttons
export interface Buch {
  isbn: string;
  rating: number | undefined;
  art: string | undefined;
  preis: number | undefined;
  rabatt: number | undefined;
  lieferbar: boolean | undefined;
  datum: string | undefined;
  homepage: string | undefined;
  schlagwoerter: string[] | undefined;
  titel:
    | { titel: string | undefined; untertitel: string | undefined }
    | undefined;
  _links: { self: { href: string } };
}

const BuchItem = (buch: Buch) => {
  return (
    <div className="container mt-5 mb-5" style={{ borderRadius: "12%" }}>
      <h1>{buch.titel?.titel}</h1>
      <p>{buch.titel?.untertitel}</p>
      <p>ISBN: {buch.isbn}</p>
      <p>Art: {buch.art}</p>
      <p>
        Rating:{" "}
        {Array.from({ length: 5 }).map((_, index) => (
          <FontAwesomeIcon
            key={index}
            icon={index < (buch.rating || 0) ? faStar : faStarRegular}
            style={{ color: index < (buch.rating || 0) ? "gold" : "black" }}
          />
        ))}
      </p>
      <p>Preis: {buch.preis}</p>
      <p>Rabatt: {buch.rabatt}</p>
      <p>Lieferbar: {buch.lieferbar ? "true" : "false"}</p>
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
