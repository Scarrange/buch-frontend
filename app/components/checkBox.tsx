export const CheckBox = (props: {
  text: string;
  name: string;
  checked?: boolean;
}) => {
  return (
    <div className="form-check">
      <input
        className="form-check-input"
        type="checkbox"
        value="true"
        id={props.name}
        name={props.name}
        style={{ cursor: "pointer" }}
        defaultChecked={props.checked}
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
