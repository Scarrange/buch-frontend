const InputLogin = (props: {
  name: string | undefined;
  placeholder: string | undefined;
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <input
      name={props.name}
      type={props.name === "password" ? "password" : "text"}
      className="form-control mt-3 "
      placeholder={props.placeholder}
      value={props.value}
      onChange={props.onChange}
      style={{ width: "630px", height: "40px" }}
      required
    />
  );
};

export default InputLogin;
