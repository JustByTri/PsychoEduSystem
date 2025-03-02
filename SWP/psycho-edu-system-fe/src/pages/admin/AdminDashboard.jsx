/* eslint-disable react/prop-types */
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
    <div className="p-8 bg-white min-h-screen text-gray-900">
      {/* Overview Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard
          icon={faUsers}
          title="Total Users"
          count="1,245"
          color="blue-500"
        />
        <DashboardCard
          icon={faCalendarCheck}
          title="Appointments"
          count="86"
          color="green-500"
        />
        <DashboardCard
          icon={faBullseye}
          title="Target Programs"
          count="12"
          color="purple-500"
        />
        <DashboardCard
          icon={faBookOpen}
          title="Bookings"
          count="254"
          color="orange-500"
        />
        <DashboardCard
          icon={faChalkboardTeacher}
          title="Classrooms"
          count="18"
          color="teal-500"
        />
        <DashboardCard
          icon={faUserFriends}
          title="Parents"
          count="742"
          color="red-500"
        />
      </section>

      {/* Detailed Sections */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <DashboardSection title="Recent Bookings">
          <p className="text-gray-600 text-center">📊 Table Placeholder</p>
        </DashboardSection>

        <DashboardSection title="Upcoming Appointments">
          <ul className="space-y-4">
            <li className="flex justify-between text-gray-700 border-b pb-2 border-gray-300">
              <span>📅 Meeting with John Doe</span>
              <span>10:30 AM</span>
            </li>
            <li className="flex justify-between text-gray-700 border-b pb-2 border-gray-300">
              <span>👨‍🏫 Parent-Teacher Conference</span>
              <span>02:00 PM</span>
            </li>
            <li className="flex justify-between text-gray-700 border-b pb-2 border-gray-300">
              <span>🎓 Student Enrollment Review</span>
              <span>05:00 PM</span>
            </li>
          </ul>
        </DashboardSection>
      </section>
    </div>
  );
};

// Simplified Card Component
const DashboardCard = ({ icon, title, count, color }) => (
  <div className="p-6 bg-white rounded-xl shadow-md transition-all duration-300 hover:scale-105">
    <div className="flex items-center">
      <FontAwesomeIcon icon={icon} className={`text-${color} w-14 h-14`} />
      <div className="ml-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-gray-700 text-lg">{count}</p>
      </div>
    </div>
  </div>
);

// Simplified Section Component
const DashboardSection = ({ title, children }) => (
  <div className="p-6 bg-white rounded-xl shadow-md transition-all duration-300 hover:scale-105">
    <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
    {children}
  </div>
);

export default AdminDashboard;
