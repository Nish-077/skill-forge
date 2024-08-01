import React from "react";

interface ContentBoxProps {
  title: String;
  learn: () => void;
}

const Content: React.FC<ContentBoxProps> = ({ title, learn }) => {
  return (
    <div
      className="flex flex-col gap-1.5 items-center justify-center rounded-full w-44 h-44 relative m-5 shadow-custom"
      style={{
        background: "linear-gradient(45deg,#E0A9BB,#8338E3)",
      }}
    >
      <p className="text-center m-1">{title}</p>
      <button
        className="bg-black rounded px-4 hover:bg-blue-800"
        onClick={learn}
      >
        Learn
      </button>
    </div>
  );
};

export default Content;