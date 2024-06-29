import React from "react";
import { FloatingMenu as TiptapFloatingMenu } from "@tiptap/react";

interface FloatingMenuProps {
  editor: any;
}

const FloatingMenu: React.FC<FloatingMenuProps> = ({ editor }) => {
  return (
    <TiptapFloatingMenu editor={editor} tippyOptions={{ duration: 0 }}>
      <div className="floating-menu ">
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 }) ? "is-active" : ""
          }
        >
          H1
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 }) ? "is-active" : ""
          }
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "is-active" : ""}
        >
          Bullet list
        </button>
      </div>
    </TiptapFloatingMenu>
  );
};

export default FloatingMenu;
