import React from "react";
import classNames from "classnames";

const sampleItems = [{ name: "fieldName", value: "value" }];

export interface KeyValueGridProps {
  items: { name: string; value: string }[];
  className?: string;
}

export const KeyValueGrid: React.FC<KeyValueGridProps> = ({
  items = sampleItems,
  className,
}) => {
  return (
    <div
      dir="rtl"
      className={classNames(
        "grid grid-cols-4 gap-x-8 gap-y-4 px-4 py-4 sm:px-6 lg:px-8 bg-gray-50",
        className
      )}
    >
      {items.map((item, index) => (
        <div key={index} className="flex flex-col">
          <p className="text-sm text-gray-500">{item.name}</p>
          <p className="font-bold text-base">{item.value}</p>
        </div>
      ))}
    </div>
  );
};
