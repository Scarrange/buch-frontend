import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader({ params }: LoaderFunctionArgs) {
  return params;
}

export default function Search() {
  const loaderData = useLoaderData<typeof loader>();
  return <h1>Search {loaderData.id }</h1>;
}
