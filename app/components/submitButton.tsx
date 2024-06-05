import React from "react";

interface SubmitButtonProps {
  text: string;
  style?: React.CSSProperties;
  className?: string;
}

const handleButtonClick = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const SubmitButton: React.FC<SubmitButtonProps> = ({
  text,
  style,
  className,
}) => {
  return (
    <div className="form-group mt-5 text-center">
      <button
        type="submit"
        className={`btn custom-btn ${className}`}
        style={style}
        onClick={handleButtonClick}
      >
        {text}
      </button>
    </div>
  );
};

export default SubmitButton;
