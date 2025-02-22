import React from 'react';

const QuickLinksCard = () => {
  const links = [
    {
      id: 1,
      title: "Academic Support",
      image: "/a1.jpg",
      link: "#"
    },
    {
      id: 2,
      title: "Career Guidance",
      image: "/a2.jpg",
      link: "#"
    },
    {
      id: 3,
      title: "Student Services",
      image: "/a3.jpg",
      link: "#"
    }
  ];

  return (
    <>
      {links.map((link) => (
        <a
          key={link.id}
          href={link.link}
          className={`${link.bgColor} rounded-2xl p-4 relative overflow-hidden group transition-transform hover:scale-[1.02]`}
        >
          <div className="relative z-10">
            <h3 className="text-white text-lg font-medium mb-2">{link.title}</h3>
            <div className="flex items-center">
              <img
                src={link.image}
                alt={link.title}
                className="w-full h-[160px] object-cover rounded-xl"
              />
            </div>
          </div>
          
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)"/>
            </svg>
          </div>
        </a>
      ))}
    </>
  );
};

export default QuickLinksCard; 