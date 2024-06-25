const Input = (props: {
  placeholder: string | undefined;
  name: string | undefined;
  required?: boolean;
  defaultValue?: string;
}) => {
  return (
    <input
      type="text"
      className="form-control mt-3"
      placeholder={props.placeholder}
      style={{ maxWidth: "400px" }}
      name={props.name}
      required={props.required}
      defaultValue={props.defaultValue}
    />
  );
};

export default Input;
