import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import Navbar from "./components/navbar";
import bootstrap from "bootstrap/dist/css/bootstrap.min.css?url";
import datepicker from "react-datepicker/dist/react-datepicker.css?url";
import customStyles from "./styles/custom.css?url";
import fontawseome from "@fortawesome/fontawesome-svg-core/styles.css?url";
import { config } from "@fortawesome/fontawesome-svg-core";
import { json, LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "./services/auth.server";

// Icons werden nicht mehr gerendered bevor css geladen wird//
config.autoAddCss = false;

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);
  return json(user);
}

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: bootstrap },
    {rel: "stylesheet", href: datepicker},
    {rel: "stylesheet", href: customStyles},
    {rel: "stylesheet", href: fontawseome},
  ];
};

export function Layout({ children }: { children: React.ReactNode }) {
  const user = useLoaderData<typeof loader>();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Buch</title>
        <Meta />
        <Links />
      </head>
      <body>
        <Navbar isLoggedIn={!!user} />
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
  const error = useRouteError();
  console.error(error);
  return (
    <Layout>
      <html lang="en">
        <head>
          <title>Oh no!</title>
          <Meta />
          <Links />
        </head>
        <body>
          <h1>Application Error du bist dumm</h1>
          <Scripts />
        </body>
      </html>
    </Layout>
  );
}
