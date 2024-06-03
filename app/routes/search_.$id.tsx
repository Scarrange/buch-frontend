import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import BuchItem from "~/components/buchItemDetail";

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;

  const response = await fetch(`https://localhost:3000/rest/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    return json({ buch: null });
  }

  const buch = await response.json();
  return json({ buch });
}

export default function BookDetailPage() {
  const { buch } = useLoaderData<typeof loader>();

  return (
    <div className="container d-flex flex-column align-items-center mt-5 form-control div-bg mb-5">
      <h1>Buchdetails</h1>
      {buch ? <BuchItem {...buch} /> : <p>Buch nicht gefunden</p>}
    </div>
  );
}
