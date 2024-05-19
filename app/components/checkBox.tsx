const CheckBox = (props: { text: string }) => {
  return (
    <div className="form-check">
      <input
        className="form-check-input"
        type="checkbox"
        value=""
        id="flexCheckDefault"
      />
      <label className="form-check-label" htmlFor="flexCheckDefault">
        {props.text}
      </label>
    </div>
  );
};

export default CheckBox;
