import React from 'react';

const FullScreenImage = () => {
  return (
    <div className="relative w-full h-screen">
      <img
        src="./grain.jpg"
        alt="Background"
        className="absolute top-0 left-0 w-full h-full object-cover opacity-100"
      />
    </div>
  );
};

export default FullScreenImage;
