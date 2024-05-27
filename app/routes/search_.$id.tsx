import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader({ params }: LoaderFunctionArgs) {
  //TODO: Nochmal das Buch mit der ID fetchen?
  return params;
}

export default function Search() {
  //TODO: Detailseite gestalten
  const loaderData = useLoaderData<typeof loader>();
  return <h1>Search {loaderData.id }</h1>;
}
