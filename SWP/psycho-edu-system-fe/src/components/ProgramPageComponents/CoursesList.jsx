import React from "react";
import Filter from "../Bar/FillterBar";
import Search from "../Bar/SearchBar";
import { useNavigate } from "react-router-dom";

// const CourseList = ({
//   searchTerm,
//   onSearchChange,
//   courses,
//   selectedCounselor,
//   selectedType,
//   onCounselorChange,
//   onTypeChange,
// }) => {
//   const counselorOptions = [
//     { value: "All", label: "All Counselors" },
//     { value: "Prof.Thinh", label: "Prof.Thinh" },
//     { value: "Dr.Jesyca", label: "Dr.Jesyca" },
//     { value: "Dr.Emily", label: "Dr.Emily" },
//   ];

//   const typeOptions = [
//     { value: "All", label: "All Types" },
//     { value: "Online", label: "Online" },
//     { value: "In-Person", label: "In-Person" },
//     { value: "Hybrid", label: "Hybrid" },
//   ];

//   const navigate = useNavigate();

//   const handleCourseClick = (courseId) => {
//     navigate(`/program/course/${courseId}`);
//   };

//   return (
//     <div className="w-full lg:w-3/4 p-6">
//       <div className="flex flex-wrap gap-4 mb-8 items-center">
//         <Search
//           value={searchTerm}
//           onChange={onSearchChange}
//           placeholder="Search courses..."
//         />

//         <Filter
//           options={counselorOptions}
//           value={selectedCounselor}
//           onChange={onCounselorChange}
//           showIcon={true}
//         />

//         <Filter
//           options={typeOptions}
//           value={selectedType}
//           onChange={onTypeChange}
//           showIcon={false}
//         />
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {courses.map((course) => (
//           <div
//             key={course.id}
//             className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
//             onClick={() => handleCourseClick(course.id)}
//           >
//             <div className="relative h-48 overflow-hidden">
//               <img
//                 src={course.image}
//                 alt={course.title}
//                 className="w-full h-full object-cover"
//                 onError={(e) => {
//                   e.target.src =
//                     "https://images.unsplash.com/photo-1516321318423-f06f85e504b3";
//                 }}
//               />
//             </div>
//             <div className="p-6">
//               <div className="flex items-center mb-2">
//                 <h3 className="text-xl font-semibold">{course.title}</h3>
//               </div>
//               <p className="text-gray-600 mb-4">{course.description}</p>
//               <div className="flex flex-wrap gap-2 mb-4">
//                 <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
//                   {course.duration}
//                 </span>
//                 <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">
//                   {course.counselor}
//                 </span>
//                 <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">
//                   {course.type}
//                 </span>
//               </div>
//               <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
//                 Enroll Now
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };
const CourseList = ({
  searchTerm,
  onSearchChange,
  courses,
  selectedCounselor,
  selectedType,
  onCounselorChange,
  onTypeChange,
}) => {
  const counselorOptions = [
    { value: "All", label: "All Counselors" },
    { value: "Prof.Thinh", label: "Prof.Thinh" },
    { value: "Dr.Jesyca", label: "Dr.Jesyca" },
    { value: "Dr.Emily", label: "Dr.Emily" },
  ];

  const typeOptions = [
    { value: "All", label: "All Types" },
    { value: "Online", label: "Online" },
    { value: "In-Person", label: "In-Person" },
    { value: "Hybrid", label: "Hybrid" },
  ];
  const navigate = useNavigate();

  return (
    <div className="flex-1">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="w-full md:w-1/3">
            <Search
              value={searchTerm}
              onChange={onSearchChange}
              placeholder="Search courses..."
              className="w-full"
            />
          </div>
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <Filter
              options={counselorOptions}
              value={selectedCounselor}
              onChange={onCounselorChange}
              showIcon={true}
              className="w-full sm:w-48"
            />
            <Filter
              options={typeOptions}
              value={selectedType}
              onChange={onTypeChange}
              showIcon={false}
              className="w-full sm:w-48"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
            onClick={() => navigate(`/program/course/${course.id}`)}
          >
            <div className="relative h-52 overflow-hidden">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3";
                }}
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {course.title}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {course.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                  {course.duration}
                </span>
                <span className="px-3 py-1.5 bg-green-50 text-green-600 rounded-full text-sm font-medium">
                  {course.counselor}
                </span>
                <span className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-full text-sm font-medium">
                  {course.type}
                </span>
              </div>
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-4 rounded-lg transition-colors duration-200 font-medium">
                Enroll Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;
