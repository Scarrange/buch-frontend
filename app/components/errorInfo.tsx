export const ErrorInfo = (props: { error?: string }) => {
  {
    return props.error ? <em className="errorInfo">{props.error}</em> : null;
  }
};
