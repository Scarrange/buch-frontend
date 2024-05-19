const Input = (props: { placeholder: string | undefined }) => {
  return (
    <input
      type="text"
      className="form-control mt-3"
      placeholder={props.placeholder}
      style={{ maxWidth: "400px" }}
    />
  );
};

export default Input;
