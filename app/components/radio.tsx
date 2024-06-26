const Radio = (props: { name: string; checked?: boolean }) => {
  return (
    <div className="form-check">
      <input
        className="form-check-input"
        type="radio"
        name="flexRadioDefault"
        id={props.name}
        style={{ cursor: "pointer" }}
        defaultChecked={props.checked}
      />
      <label
        className="form-check-label"
        htmlFor={props.name}
        style={{ cursor: "pointer" }}
      >
        {props.name}
      </label>
    </div>
  );
};

export default Radio;
