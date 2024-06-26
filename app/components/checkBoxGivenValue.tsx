import { useState } from "react";

export const CheckBox = (props: {
  text: string;
  name: string;
  checked: boolean;
}) => {
  const [checked, setChecked] = useState(props.checked);

  return (
    <div className="form-check">
      <input
        className="form-check-input"
        type="checkbox"
        id={props.name}
        name={props.name}
        style={{ cursor: "pointer" }}
        checked={checked}
        onChange={() => setChecked(!checked)}
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
