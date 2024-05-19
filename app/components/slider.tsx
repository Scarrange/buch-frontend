import React, { useState } from "react";

const SliderWithValue = (props: { min: number; max: number; text: string }) => {
  const [value, setValue] = useState(
    Math.floor((props.max - props.min) / 2 + 1),
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(event.target.value));
  };

  return (
    <div
      className="container mt-3 d-flex form-control"
      style={{ maxWidth: "400px" }}
    >
      <label htmlFor="customRange3" className="form-label me-4">
        {props.text}: {value}
      </label>
      {/* <div className="d-flex justify-content-center"> */}
      <input
        type="range"
        className="form-range"
        min={props.min}
        max={props.max}
        step="1"
        id="customRange3"
        value={value}
        onChange={handleChange}
        list="tickmarks"
        style={{ flex: 1 }}
      />
      {/* </div> */}
    </div>
  );
};

export default SliderWithValue;
