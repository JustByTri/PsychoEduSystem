import "../../styles/index.css";

const notifications = [
  "Study harder",
  "Good things are always waiting ahead",
  "Enjoy your life more",
  "Where there is hope, pain becomes joy.",
  "Everything must be viewed from many perspectives.",
];

const Notification = () => {
  return (
    <div className="w-full overflow-hidden bg-[#e0f4f1]">
      <div className="animate-marquee flex space-x-10">
        {notifications.map((notification, index) => (
          <div
            key={index}
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
