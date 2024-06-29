import React, { ReactElement } from "react";
import classNames from "classnames";

type ButtonSize = "xs" | "sm" | "md" | "lg";
type ButtonVariant = "primary" | "secondary" | "soft";

interface ButtonProps {
  size?: ButtonSize;
  variant?: ButtonVariant;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  icon?: ReactElement;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  size = "md",
  variant = "primary",
  children,
  onClick,
  className,
  icon,
  loading = false,
}) => {
  const sizeClasses = {
    xs: "px-2 py-1 text-xs",
    sm: "px-2 py-1 text-sm",
    md: "px-3 py-2 text-sm",
    lg: "px-3.5 py-2.5 text-sm",
  };

  const variantClasses = {
    primary:
      "rounded bg-indigo-600 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
    secondary:
      "rounded bg-white font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
    soft:
      "rounded bg-indigo-50 font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100",
  };

  const buttonClass = classNames(
    "inline-flex items-center gap-x-1.5",
    variantClasses[variant],
    sizeClasses[size],
    className,
    { "opacity-50 cursor-not-allowed": loading }
  );

  return (
    <button
      type="button"
      className={buttonClass}
      onClick={loading ? undefined : onClick}
      disabled={loading}
    >
      {loading && <span className="loading loading-spinner loading-xs"></span>}
      {!loading && icon && <span className="-ml-0.5">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
