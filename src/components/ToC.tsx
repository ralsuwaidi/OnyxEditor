import React from "react";
import { Editor } from "@tiptap/core";
import { TextSelection } from "@tiptap/pm/state";

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

const ToCEmptyState: React.FC = () => {
  return (
    <div className="empty-state">
      <p>Start editing your document to see the outline.</p>
    </div>
  );
};

interface ToCProps {
  items: {
    id: string;
    isActive: boolean;
    isScrolledOver: boolean;
    level: number;
    itemIndex: number;
    textContent: string;
  }[];
  editor: Editor | null;
}

const ToC: React.FC<ToCProps> = ({ items = [], editor }) => {
  if (items.length === 0) {
    return <ToCEmptyState />;
  }

  const onItemClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();

    if (editor) {
      const element = editor.view.dom.querySelector(`[data-toc-id="${id}"]`);
      if (element) {
        const pos = editor.view.posAtDOM(element, 0);

        // set focus
        const tr = editor.view.state.tr;

        tr.setSelection(new TextSelection(tr.doc.resolve(pos)));

        editor.view.dispatch(tr);

        editor.view.focus();

        if (history.pushState) {
          history.pushState(null, "", `#${id}`);
        }

        window.scrollTo({
          top: element.getBoundingClientRect().top + window.scrollY,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <>
      {items.map((item) => (
        <ToCItem onItemClick={onItemClick} key={item.id} item={item} />
      ))}
    </>
  );
};

export { ToCItem, ToCEmptyState, ToC };