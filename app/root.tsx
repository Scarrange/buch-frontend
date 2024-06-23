import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import Navbar from "./components/navbar";
import bootstrap from "bootstrap/dist/css/bootstrap.min.css?url";
import customStyles from "./styles/custom.css?url";
import { config } from "@fortawesome/fontawesome-svg-core";
import {
  json,
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { authenticator } from "./services/auth.server";
import { ApplicationError } from "./components/applicationError";
import fontawesome from "@fortawesome/fontawesome-svg-core/styles.css?url";

// Icons werden nicht mehr gerendered bevor css geladen wird//
config.autoAddCss = false;

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionInfo = await authenticator.isAuthenticated(request);
  const roles = sessionInfo?.roles ?? [];
  return json({ roles });
}

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: bootstrap },
    { rel: "stylesheet", href: customStyles },
    { rel: "stylesheet", href: fontawesome },
  ];
};

export const meta: MetaFunction = ({ error }) => {
  return [
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "description", content: "Buch" },
    { charSet: "utf-8" },
    { title: error ? "Oh no!" : "Buch" },
  ];
};

export function Layout({ children }: { children: React.ReactNode }) {
  const loaderData = useLoaderData<typeof loader>();
  const isLoggedIn =
    loaderData?.roles.includes("user") || loaderData?.roles.includes("admin");

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Navbar isLoggedIn={isLoggedIn} />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  return <ApplicationError />;
}
