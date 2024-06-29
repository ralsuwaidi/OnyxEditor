import React from "react";

interface LoadingProps {
  height?: string; // Optional prop for height, default to 'h-48'
}

const Loading: React.FC<LoadingProps> = ({ height = "h-48" }) => {
  return (
    <div className={`flex justify-center items-center w-full ${height}`}>
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );
};

export default Loading;
