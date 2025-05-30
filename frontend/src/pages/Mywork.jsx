import React, { useEffect } from "react";
import WorkItem from "../components/work/works";
import Progress from "../components/work/progress";
import Contact from "../components/sections/Contact";
import TitleBraker from "../components/sections/TitleBraker";
import Footer from "../components/sections/Footer";

const myWorks = [
  {
    title: "CMS Website",
    description:
      "Designed and developed a website for a client who does live wedding sketching, capturing the essence of their artistry.",
    imagePath: "klara-client/background-gif.gif",
    tags: [
      "Research",
      "Creativity",
      "Design",
      "Prototype",
      "Development",
      "Host",
    ],
  },
  {
    title: "Web Design & Branding",
    description: "Web design for a jewelry startup (work in progress)",
    imagePath: "karlo-client/karlo-edit.gif",
    tags: ["Research", "UI/UX", "Design", "Branding", "..."],
  },
  {
    title: "SAAS Landing Page & Branding",
    description:
      "Created a modern landing page for a SaaS product, emphasizing user engagement and a strong brand identity.",
    imagePath: "resq/resq-edit.gif",
    tags: ["Research", "UI/UX", "Design", "Development", "Branding"],
  },
  {
    title: "Web Design",
    description:
      "Designed a web application for users to securely store and manage their trading history, providing insights and analytics to enhance their trading strategies.",
    imagePath: "tradekeeper/tradekeeper-edit.gif",
    tags: ["Research", "UI/UX", "Design"],
  },
  {
    title: "Personal Landing Page",
    description: "Build my personal portfolio website.",
    imagePath: "old-portfolio/oldwebsite-edit.gif",
    tags: [
      "Research",
      "Creativity",
      "Design",
      "Prototype",
      "Development",
      "Host",
    ],
  },
  {
    title: "Final Work",
    description:
      "Final work for university focused on developing a comprehensive restaurant reservation system.",
    imagePath: "zavrsni/zavrsni-edit.gif",
    tags: [
      "Research",
      "Creativity",
      "Design",
      "Prototype",
      "Branding",
      "Development",
    ],
  },
];

const MyWorkPage = () => {
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <div className="text-white md:max-w-7xl mx-auto mt-36">
        <h1 className="text-4xl md:text-6xl mb-28 font-bold leading-[3rem] font-montserrat px-6">
          Guiding ideas into impactful digital experiences.
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:max-w-7xl md:mx-auto px-6">
          {myWorks.map((work, index) => (
            <WorkItem work={work} index={index} />
          ))}
        </div>
        <Progress />
        <Contact />
        <TitleBraker message="TODAY’S DECISION MAKES FUTURE SIMPLE" />
      </div>
      <Footer className="w-full" />
    </div>
  );
};

export default MyWorkPage;
