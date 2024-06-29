import React from "react";
import ButtonGroup from "../components/common/ButtonGroup";

interface EditorToolbarProps {
  editor: any;
  setLink: () => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor, setLink }) => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-white shadow-md p-4 z-50">
      <ButtonGroup
        size="md"
        variant="default"
        buttons={[
          {
            label: "Bold",
            onClick: () => editor.chain().focus().toggleBold().run(),
            active: editor.isActive("bold"),
          },
          {
            label: "Italic",
            onClick: () => editor.chain().focus().toggleItalic().run(),
            active: editor.isActive("italic"),
          },
          {
            label: "Link",
            onClick: setLink,
            active: editor.isActive("link"),
          },
        ]}
      />
    </div>
  );
};

export default EditorToolbar;
