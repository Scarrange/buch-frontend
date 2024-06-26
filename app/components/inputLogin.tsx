export const InputLogin = (props: {
  name: string | undefined;
  placeholder: string | undefined;
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <input
      name={props.name}
      type={props.name === "password" ? "password" : "text"}
      className="form-control mt-3 input-login"
      placeholder={props.placeholder}
      value={props.value}
      onChange={props.onChange}
      required
    />
  );
};
