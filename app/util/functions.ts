import { BuchError, BuchInput } from "./types";

export const validateBookData = (bookData: BuchInput) => {
  const errors: BuchError = {};
  const isbnRegex =
    "^(?=[0-9]{13}$|(?=(?:[0-9]+[-●]){4})[-●0-9]{17}$)97[89][-●]?[0-9]{1,5}[-●]?[0-9]+[-●]?[0-9]+[-●]?[0-9]$";

  if (!bookData.isbn.match(isbnRegex)) {
    errors.isbn = "ISBN muss vom Typ ISBN-13 sein";
  }

  if (
    !bookData.titel.titel?.match("^\\w.*") ||
    bookData.titel.titel?.length > 40
  ) {
    errors.titel = "Der Titel muss zwischen 1 und 40 Zeichen lang sein";
  }

  if (bookData.titel.untertitel && bookData.titel.untertitel.length > 40) {
    errors.untertitel = "Der Untertitel darf maximal 40 Zeichen lang sein";
  }

  if (isNaN(bookData.rating) || bookData.rating < 0 || bookData.rating > 5) {
    errors.rating = "Rating muss zwischen 0 und 5 liegen";
  }

  if (!["", "KINDLE", "DRUCKAUSGABE"].includes(bookData.art ?? "")) {
    errors.art = "Buchart ist ungültig";
  }

  if (isNaN(bookData.preis) || bookData.preis <= 0) {
    errors.preis = "Preis muss größer 0 sein";
  }

  if (bookData.preis.toString().length > 6) {
    errors.preis = "Preis darf maximal 7 Stellen haben";
  }

  if (isNaN(bookData.rabatt) || bookData.rabatt < 0 || bookData.rabatt > 1) {
    errors.rabatt = "Rabatt muss zwischen 0 und 1 liegen";
  }

  if (bookData.datum && !bookData.datum.match("^[0-9]{4}-[0-9]{2}-[0-9]{2}$")) {
    errors.datum = "Datum muss dem Format yyyy/mm/dd entsprechen";
  }

  if (bookData.homepage && !bookData.homepage.includes(".")) {
    errors.homepage = "Homepage muss eine URL sein";
  }

  return errors;
};

export const getBuchInput = (formData: FormData): BuchInput => {
  const js = formData.get("javascript") ? "JAVASCRIPT" : null;
  const ts = formData.get("typescript") ? "TYPESCRIPT" : null;

  return {
    isbn: String(formData.get("isbn")),
    titel: {
      titel: String(formData.get("titel")),
      untertitel: String(formData.get("untertitel")) || undefined,
    },
    homepage: String(formData.get("homepage")) || undefined,
    art: String(formData.get("art")) || undefined,
    datum: String(formData.get("datum")) || undefined,
    preis: Number(String(formData.get("preis"))),
    rabatt: Number(String(formData.get("rabatt"))),
    lieferbar: Boolean(formData.get("lieferbar")),
    rating: Number(String(formData.get("rating"))),
    schlagwoerter: [js, ts].filter((e) => e != null),
  };
};
