import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import Navbar from "./components/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import "./styles/custom.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "./services/auth.server";

// Icons werden nicht mehr gerendered bevor css geladen wird//
config.autoAddCss = false;

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);
  return json(user);
}

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

export function errorBoundary({ error }: { error: Error }) {
  return (
    <Layout>
      <h1>Application Error du bist Dumm</h1>
      <pre>{error.message}</pre>
    </Layout>
  );
}
