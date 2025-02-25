import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faCalendarCheck,
  faBullseye,
  faBookOpen,
  faChalkboardTeacher,
  faUserFriends,
} from "@fortawesome/free-solid-svg-icons";

const AdminDashboard = () => {
  return (
    <div className="p-8 bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-white">
      {/* Overview Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard
          icon={faUsers}
          title="Total Users"
          count="1,245"
          color="blue-400"
        />
        <DashboardCard
          icon={faCalendarCheck}
          title="Appointments"
          count="86"
          color="green-400"
        />
        <DashboardCard
          icon={faBullseye}
          title="Target Programs"
          count="12"
          color="purple-400"
        />
        <DashboardCard
          icon={faBookOpen}
          title="Bookings"
          count="254"
          color="orange-400"
        />
        <DashboardCard
          icon={faChalkboardTeacher}
          title="Classrooms"
          count="18"
          color="teal-400"
        />
        <DashboardCard
          icon={faUserFriends}
          title="Parents"
          count="742"
          color="red-400"
        />
      </section>

      {/* Detailed Sections */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <DashboardSection title="Recent Bookings">
          <p className="text-gray-300 text-center">📊 Table Placeholder</p>
        </DashboardSection>

        <DashboardSection title="Upcoming Appointments">
          <ul className="space-y-4">
            <li className="flex justify-between text-gray-200 border-b pb-2 border-gray-600">
              <span>📅 Meeting with John Doe</span>
              <span>10:30 AM</span>
            </li>
            <li className="flex justify-between text-gray-200 border-b pb-2 border-gray-600">
              <span>👨‍🏫 Parent-Teacher Conference</span>
              <span>02:00 PM</span>
            </li>
            <li className="flex justify-between text-gray-200 border-b pb-2 border-gray-600">
              <span>🎓 Student Enrollment Review</span>
              <span>05:00 PM</span>
            </li>
          </ul>
        </DashboardSection>
      </section>
    </div>
  );
};

// 3D Effect Card Component
const DashboardCard = ({ icon, title, count, color }) => (
  <div className="relative p-6 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-gray-800/30 to-transparent rounded-xl"></div>
    <div className="relative flex items-center">
      <FontAwesomeIcon
        icon={icon}
        className={`text-${color} w-14 h-14 drop-shadow-lg`}
      />
      <div className="ml-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-gray-300 text-lg">{count}</p>
      </div>
    </div>
  </div>
);

// Glassmorphic Section Component
const DashboardSection = ({ title, children }) => (
  <div className="p-6 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg transition-all duration-300 hover:scale-105">
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    {children}
  </div>
);

export default AdminDashboard;
