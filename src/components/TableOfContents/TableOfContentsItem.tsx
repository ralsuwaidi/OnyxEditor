import React from "react";

interface ToCItemProps {
  item: {
    id: string;
    isActive: boolean;
    isScrolledOver: boolean;
    level: number;
    itemIndex: number;
    textContent: string;
  };
  onItemClick: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
}

const ToCItem: React.FC<ToCItemProps> = ({ item, onItemClick }) => {
  return (
    <div
      className={`${item.isActive && !item.isScrolledOver ? "is-active" : ""} ${
        item.isScrolledOver ? "is-scrolled-over" : ""
      }`}
      style={
        {
          "--level": item.level,
        } as React.CSSProperties
      }
    >
      <a
        href={`#${item.id}`}
        onClick={(e) => onItemClick(e, item.id)}
        data-item-index={item.itemIndex}
      >
        {item.textContent}
      </a>
    </div>
  );
};

export { ToCItem };
