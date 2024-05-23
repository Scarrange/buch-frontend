import React from 'react';

interface SubmitButtonProps {
  text: string;
  style?: React.CSSProperties;
  className?: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ text, style, className, ...props }) => {
  return (
    <div className="form-group mt-5 text-center">
      <button
        type="submit"
        className={`btn custom-btn ${className}`}
        style={style}
        {...props}
      >
        {text} 
      </button>
    </div>
  );
};

export default SubmitButton;
// Dies ist ein Commit Test.
const number = 8;
number + 8;