import React from "react";
import classNames from "classnames";

type BadgeColor =
  | "gray"
  | "red"
  | "yellow"
  | "green"
  | "blue"
  | "indigo"
  | "purple"
  | "pink";

interface BadgeProps {
  color: BadgeColor;
  text: string;
  showDot?: boolean;
}

const Badge: React.FC<BadgeProps> = ({ color, text, showDot = false }) => {
  const badgeClass = classNames(
    "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
    {
      "bg-gray-50 text-gray-600 ring-gray-500/10": color === "gray",
      "bg-red-50 text-red-700 ring-red-600/10": color === "red",
      "bg-yellow-50 text-yellow-800 ring-yellow-600/20": color === "yellow",
      "bg-green-50 text-green-700 ring-green-600/20": color === "green",
      "bg-blue-50 text-blue-700 ring-blue-700/10": color === "blue",
      "bg-indigo-50 text-indigo-700 ring-indigo-700/10": color === "indigo",
      "bg-purple-50 text-purple-700 ring-purple-700/10": color === "purple",
      "bg-pink-50 text-pink-700 ring-pink-700/10": color === "pink",
    }
  );

  const dotClass = classNames("h-1.5 w-1.5", {
    "fill-gray-400": color === "gray",
    "fill-red-500": color === "red",
    "fill-yellow-500": color === "yellow",
    "fill-green-500": color === "green",
    "fill-blue-500": color === "blue",
    "fill-indigo-500": color === "indigo",
    "fill-purple-500": color === "purple",
    "fill-pink-500": color === "pink",
  });

  return (
    <span
      className={`inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium ${badgeClass}`}
    >
      {showDot && (
        <svg className={dotClass} viewBox="0 0 6 6" aria-hidden="true">
          <circle cx={3} cy={3} r={3} />
        </svg>
      )}
      <span>{text}</span>
    </span>
  );
};

export default Badge;
