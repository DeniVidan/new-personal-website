import React, { useEffect } from 'react';
import WorkItem from '../components/work/works';
import Progress from '../components/work/progress';

const myWorks = [
  {
    title: "Project 1",
    description: "Designed and developed a website for a client who does live wedding sketching, capturing the essence of their artistry.",
    imagePath: "klara-client/background-gif.gif",
    tags: ["Research", "Creativity", "Design", "Prototype", "Development"]
  },
  {
    title: "Project 2",
    description: "Revamp an e-commerce platform.",
    imagePath: "klara-client/background-gif.gif",
    tags: ["UI/UX", "Development", "Branding"]
  },
  {
    title: "Project 3",
    description: "Create a mobile application for local services.",
    imagePath: "klara-client/background-gif.gif",
    tags: ["Research", "Design", "Development"]
  },
  {
    title: "Project 4",
    description: "Design a marketing campaign for a startup.",
    imagePath: "klara-client/background-gif.gif",
    tags: ["Creativity", "Design", "Marketing"]
  },
  {
    title: "Project 5",
    description: "Build a personal portfolio website.",
    imagePath: "klara-client/background-gif.gif",
    tags: ["Web Development", "Design"]
  },
  {
    title: "Project 6",
    description: "Develop a blog platform.",
    imagePath: "klara-client/background-gif.gif",
    tags: ["Development", "Content Management"]
  }
];

const MyWorkPage = () => {
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="text-white p-6 md:max-w-7xl md:mx-auto">
      <h1 className="text-4xl md:text-6xl mb-28 font-bold leading-[3rem] font-montserrat">Guiding ideas into impactful digital experiences.</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:max-w-7xl md:mx-auto">
        {myWorks.map((work, index) => (
          <WorkItem work={work} index={index} />
        ))}
      </div>
      <Progress />
    </div>
  );
};

export default MyWorkPage;