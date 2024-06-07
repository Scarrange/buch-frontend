//TODO CheckLogin Funktionalität verschieben
export interface ErrorResponse {
  statusCode: number;
  message: string;
}

export interface Buch {
  isbn: string;
  rating: number;
  art?: string | undefined;
  preis: number;
  rabatt: number;
  lieferbar: boolean;
  datum?: string | undefined;
  homepage?: string | undefined;
  schlagwoerter?: string[] | undefined;
  titel: { titel: string; untertitel?: string | undefined } | undefined;
  _links: { self: { href: string } };
}

export type BuchError = {
  isbn?: string;
  titel?: string;
  untertitel?: string;
  rating?: string;
  art?: string;
  preis?: string;
  rabatt?: string;
  lieferbar?: string;
  datum?: string;
  homepage?: string;
};

export type BuchInput = Omit<Buch, "_links">;
