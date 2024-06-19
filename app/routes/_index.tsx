import book from "images/book.png";

export default function Index() {
  return (
    <div className="container">
      <div className="container d-flex flex-column align-items-center mt-5 mb-5 form-control div-bg">
        <h1>Startseite</h1>
        <img
          src={book}
          className="img-fluid mx-auto d-block"
          alt="book"
        />
      </div>
    </div>
  );
}
