import React from "react";
import { BubbleMenu as TiptapBubbleMenu } from "@tiptap/react";
import ButtonGroup from "../common/ButtonGroup";

interface BubbleMenuProps {
  editor: any;
  setLink: () => void;
}

const BubbleMenu: React.FC<BubbleMenuProps> = ({ editor, setLink }) => {
  return (
    <TiptapBubbleMenu editor={editor} tippyOptions={{ duration: 0 }}>
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
    </TiptapBubbleMenu>
  );
};

export default BubbleMenu;
