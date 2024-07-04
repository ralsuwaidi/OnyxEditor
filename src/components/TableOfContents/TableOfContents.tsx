import React from "react";
import { Editor } from "@tiptap/core";
import { TextSelection } from "@tiptap/pm/state";
import { ToCItem } from "./TableOfContentsItem";

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

const TableOfContents: React.FC<ToCProps> = ({ items = [], editor }) => {
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

        // Smooth scroll to the heading
        const scrollContainer = document.querySelector(
          ".ion-content-scroll-host"
        );
        if (scrollContainer) {
          scrollContainer.scrollTo({
            top: element.getBoundingClientRect().top + window.scrollY,
            behavior: "smooth",
          });
        }
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

export { ToCItem, ToCEmptyState, TableOfContents };
