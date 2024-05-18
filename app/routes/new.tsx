export default function newBookPage() {
  return (
    <div className="container d-flex flex-column align-items-center mt-5">
      <h1>Neues Buch anlegen</h1>
      <input
        type="text"
        className="form-control mt-3"
        placeholder="ISBN"
        style={{ maxWidth: "400px" }}
      />
    </div>
  );
}
