import React from 'react';

const WorkItem = ({ work, index }) => (
  <div 
    className={`space-y-5 mb-20 md:mb-0 p-6 ${index % 2 === 1 ? 'md:mt-[200px]' : ''} w-full`} 
    key={index}
  >
    <img 
      src={work.imagePath} 
      alt={work.title} 
      className="h-80 md:h-96 rounded-3xl mb-4 w-full object-cover" 
    />
    <h2 className="text-4xl font-bold mb-2 font-montserrat">{work.title}</h2>
    <p className="mb-1 font-raleway">{work.description}</p>
    <p className="text-sm opacity-60 font-raleway">{work.tags.join(' · ')}</p>
  </div>
);

export default WorkItem;
