import book from "images/book.png";

const Index = () => {
  return (
    <div className="container">
      <div className="container d-flex flex-column align-items-center mt-5 mb-3 form-control div-bg">
        <h1>Startseite</h1>
        <img src={book} className="img-fluid mx-auto d-block" alt="book" />
      </div>
    </div>
  );
};

export default Index;
