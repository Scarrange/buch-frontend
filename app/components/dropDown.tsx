const Dropdown = () => {
  return (
    <div className="input-group mt-3" style={{ maxWidth: "400px" }}>
      <label className="input-group-text" htmlFor="inputGroupSelect01">
        Buchart
      </label>
      <select className="form-select" id="inputGroupSelect01">
        <option value="1">Druckausgabe</option>
        <option value="2">Kindle</option>
      </select>
    </div>
  );
};
export default Dropdown;
