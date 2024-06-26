import classNames from "classnames";
import React from "react";

interface SubmitButtonProps {
  text: string;
  style?: React.CSSProperties;
  className?: string;
}

const handleButtonClick = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  text,
  style,
  className,
}) => {
  return (
    <div className="form-group mt-5 text-center w-100">
      <button
        type="submit"
        className={classNames("btn", "custom-btn", className)}
        style={style}
        onClick={handleButtonClick}
      >
        {text}
      </button>
    </div>
  );
};
