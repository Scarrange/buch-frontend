import { JwtPayload } from "jsonwebtoken";

export interface ErrorResponse {
  statusCode: number;
  message: string;
}

export interface Buch {
  isbn: string;
  rating: number;
  art?: string;
  preis: number;
  rabatt: number;
  lieferbar: boolean;
  datum?: string;
  homepage?: string;
  schlagwoerter?: string[];
  titel: { titel: string; untertitel?: string };
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

export type DecodedJwtToken = JwtPayload & {
  resource_access: {
    "buch-client": { roles: string[] };
  };
};

export type SessionInfo = {
  accessToken: string;
  roles: string[];
};

export type BuchInput = Omit<Buch, "_links">;

export function transformInput(formData: FormData): BuchInput {
  return {
    isbn: String(formData.get("isbn")),
    titel: {
      titel: String(formData.get("titel")),
      untertitel: String(formData.get("untertitel")) || undefined,
    },
    homepage: String(formData.get("homepage")) || undefined,
    art: String(formData.get("art")) || undefined,
    datum: String(formData.get("datum")) || undefined,
    preis: parseFloat(String(formData.get("preis"))),
    rabatt: parseFloat(String(formData.get("rabatt"))),
    lieferbar: formData.get("lieferbar") === "true",
    rating: parseFloat(String(formData.get("rating"))),
    schlagwoerter: [
      String(formData.get("schlagwort1")),
      String(formData.get("schlagwort2")),
    ].filter((e) => e),
  };
}
