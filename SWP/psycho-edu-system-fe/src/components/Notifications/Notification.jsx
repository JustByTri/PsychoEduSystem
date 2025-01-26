import "../../styles/index.css";

const notifications = [
  "Notification 1",
  "Notification 2",
  "Notification 3",
  "Notification 4",
  "Notification 5",
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
