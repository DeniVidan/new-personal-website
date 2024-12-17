import React from 'react';

const MyWorkPage = () => {
  return (
    <div className="text-white p-6 md:max-w-7xl md:mx-auto">
      <h1 className="text-4xl md:text-6xl mb-44 mt-20 font-bold leading-[3rem]">Guiding ideas into impactful digital experiences.</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:max-w-7xl md:mx-auto">
        {Array.from({ length: 6 }).map((_, index) => (
          <div 
            className={`space-y-5 mb-20 md:mb-0 ${index % 2 === 1 ? 'md:mt-[200px]' : ''} w-full`} 
            key={index}
          >
            <div className="bg-gray-400 h-80 md:h-96 rounded-3xl mb-4 w-full"></div>
            <h2 className="text-4xl font-bold mb-2">Project {index + 1}</h2>
            <p className="mb-1">Transform a small business identity.</p>
            <p className="text-sm opacity-60">Research · Creativity · Design · Prototype · Development · Branding</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyWorkPage;