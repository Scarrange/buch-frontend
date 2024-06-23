import { JwtPayload } from "jsonwebtoken";
import https from "https";

export const buchUrl = "https://localhost:3000";

export const certificateAgent = new https.Agent({ rejectUnauthorized: false });

export interface ApiResponse {
  _embedded?: { buecher: Buch[] };
  access_token?: string;
}

export interface ErrorResponse {
  errors: unknown;
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
