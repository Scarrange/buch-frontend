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
  //TODO: Paar Infos rausschmeißen und nur in Detailansicht anzeigen
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
