const InputLogin = (props: { placeholder: string | undefined }) => {
    return (
      <input
        type="text"
        className="form-control mt-3"
        placeholder={props.placeholder}
        style={{ width: '632.26px', height: '40px' }}
      />
    );
  };
  
  export default InputLogin;