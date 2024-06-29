import React from "react";
import classNames from "classnames";

type ButtonGroupSize = "xs" | "sm" | "md" | "lg";
type ButtonGroupVariant = "default" | "primary" | "secondary";

interface ButtonGroupProps {
  size?: ButtonGroupSize;
  variant?: ButtonGroupVariant;
  buttons: Array<{ label: string; onClick?: () => void; active?: boolean }>;
  className?: string;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  size = "md",
  variant = "default",
  buttons,
  className,
}) => {
  const sizeClasses = {
    xs: "px-2 py-1 text-xs",
    sm: "px-2 py-1 text-sm",
    md: "px-3 py-2 text-sm",
    lg: "px-3.5 py-2.5 text-sm",
  };

  const variantClasses = {
    default:
      "bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
    primary:
      "bg-indigo-600 text-white ring-1 ring-inset ring-indigo-600 hover:bg-indigo-500",
    secondary:
      "bg-gray-100 text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-200",
  };

  const buttonClass = classNames(
    "relative inline-flex items-center font-semibold focus:z-10",
    sizeClasses[size],
    variantClasses[variant]
  );

  return (
    <span
      className={classNames(
        "isolate inline-flex rounded-md shadow-sm",
        className
      )}
    >
      {buttons.map((button, index) => (
        <button
          key={index}
          type="button"
          className={classNames(buttonClass, {
            "rounded-l-md": index === 0,
            "-ml-px": index !== 0,
            "rounded-r-md": index === buttons.length - 1,
            "bg-indigo-600 text-white": button.active, // Changed to a better color
          })}
          onClick={button.onClick}
        >
          {button.label}
        </button>
      ))}
    </span>
  );
};

export default ButtonGroup;
