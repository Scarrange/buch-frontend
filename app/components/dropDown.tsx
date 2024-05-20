const Dropdown = () => {
  return (
    <div className="input-group mt-3" style={{ maxWidth: "400px" }}>
      <label className="input-group-text" htmlFor="inputGroupSelect01">
        Buchart
      </label>
      <select className="form-select" id="inputGroupSelect01">
        <option selected>Druckausgabe</option>
        <option value="1">Kindle</option>
      </select>
    </div>
  );
};
export default Dropdown;
