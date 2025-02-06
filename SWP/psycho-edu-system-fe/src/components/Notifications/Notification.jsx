import "../../styles/index.css";

const notifications = [
  "People with low skills often overestimate themselves.",
  "More money doesn’t always mean more happiness.",
  "Emotions like laughter are contagious.",
  "Silence makes you seem more confident.",
  "You remember the first and last things best.",
];

const Notification = () => {
  return (
    <div className="w-full overflow-hidden bg-[#e0f4f1]">
      <div className="flex space-x-10 animate-marquee whitespace-nowrap">
        {notifications.map((notification, index) => (
          <div
            key={index}
            className="text-slate-800 text-sm text-opacity-70 bg-transparent text-center py-2 px-5"
          >
            {notification}
          </div>
        ))}
        {/* Duplicate notifications for smooth looping */}
        {notifications.map((notification, index) => (
          <div
            key={`dup-${index}`}
            className="text-slate-800 text-sm text-opacity-70 bg-transparent text-center py-2 px-5"
          >
            {notification}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;
