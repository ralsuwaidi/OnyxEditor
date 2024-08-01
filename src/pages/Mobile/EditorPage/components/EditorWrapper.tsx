import React from "react";

const EditorWrapper: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <div className="flex items-center justify-center">
    <div className="w-full max-w-4xl">{children}</div>
  </div>
);

export default EditorWrapper;
