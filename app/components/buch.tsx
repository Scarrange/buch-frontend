export interface Buch {
  isbn: string;
  rating: number | undefined;
  art: string | undefined;
  preis: number | undefined;
  rabatt: number | undefined;
  lieferbar: boolean | undefined;
  datum: string | Date | undefined;
  homepage: string | undefined;
  schlagwoerter: string[] | undefined;
  titel:
    | { titel: string | undefined; untertitel: string | undefined }
    | undefined;
}

const BuchItem = (buch: Buch) => {
  return (
    <div>
      <h1>{buch.titel?.titel}</h1>
      <p>{buch.titel?.untertitel}</p>
      
    </div>
  );
};

export default BuchItem;
