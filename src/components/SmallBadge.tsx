import React from "react";

interface SmallBadgeProps {
  tag: string;
}

const SmallBadge: React.FC<SmallBadgeProps> = ({ tag }) => {
  return (
    <span
      className="inline-flex items-center rounded-md px-1 py-0.5 text-xs font-medium whitespace-nowrap 
                 bg-gray-100 text-gray-600 
                 dark:bg-gray-400/10 dark:text-gray-400 dark:ring-1 dark:ring-inset dark:ring-gray-400/20"
    >
      {tag}
    </span>
  );
};

export default SmallBadge;
