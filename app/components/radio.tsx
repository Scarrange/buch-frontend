const Radio = (props: { name: string }) => {
  return (
    <div className="form-check">
      <input
        className="form-check-input"
        type="radio"
        name="flexRadioDefault"
        id="flexRadioDefault1"
        defaultChecked
      />
      <label className="form-check-label" htmlFor="flexRadioDefault1">
        {props.name}
      </label>
    </div>
  );
};

export default Radio;
