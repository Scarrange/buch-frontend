const Dropdown = (props: { name: string; items: string[] }) => {
  return (
    <div className="input-group mt-3" style={{ maxWidth: "400px" }}>
      <label className="input-group-text" htmlFor="inputGroupSelect01">
        {props.name}
      </label>
      <select className="form-select" id="inputGroupSelect01">
        {props.items.map((item: string, index: number) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
};
export default Dropdown;
