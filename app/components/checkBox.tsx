const CheckBox = (props: { text: string; name: string }) => {
  return (
    <div className="form-check">
      <input
        className="form-check-input"
        type="checkbox"
        value=""
        id={props.name}
        name={props.name}
        style={{ cursor: "pointer" }}
      />
      <label
        className="form-check-label"
        htmlFor={props.name}
        style={{ cursor: "pointer" }}
      >
        {props.text}
      </label>
    </div>
  );
};

export default CheckBox;
