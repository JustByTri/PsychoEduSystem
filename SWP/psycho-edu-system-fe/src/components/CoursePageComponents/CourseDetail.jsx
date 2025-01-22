import { useEffect, useState } from "react";
import { courseListData, courseTopicsData } from "../../data/courseData";

/**
 * Component hiển thị chi tiết của một khóa học
 * @param {string} courseId - ID của khóa học
 * @param {object} selectedTopic - Topic hiện tại được chọn
 */
const CourseDetail = ({ courseId, selectedTopic }) => {
  const [course, setCourse] = useState(null);
  const [topicSteps, setTopicSteps] = useState([]);

  useEffect(() => {
    const courseDetail = courseListData.find(
      (c) => c.id === parseInt(courseId)
    );
    setCourse(courseDetail);
  }, [courseId]);

  useEffect(() => {
    if (selectedTopic) {
      setTopicSteps(selectedTopic.steps || []);
    }
  }, [selectedTopic]);

  if (!course)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="w-full lg:w-3/4 p-8 bg-white overflow-y-auto">
      {/* Course Header */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <h1 className="text-4xl font-bold text-gray-900">{course.title}</h1>
          <button className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5">
            Enroll Now
          </button>
        </div>

        {/* Course Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-xl">
            <span className="text-blue-600 font-medium">{course.duration}</span>
            <p className="text-sm text-gray-600 mt-1">Course Duration</p>
          </div>
          <div className="bg-green-50 p-4 rounded-xl">
            <span className="text-green-600 font-medium">
              {course.counselor}
            </span>
            <p className="text-sm text-gray-600 mt-1">Course Instructor</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl">
            <span className="text-purple-600 font-medium">{course.type}</span>
            <p className="text-sm text-gray-600 mt-1">Course Type</p>
          </div>
        </div>

        <p className="text-gray-600 text-lg leading-relaxed">
          {course.description}
        </p>
      </div>

      {/* Topic Content */}
      {selectedTopic ? (
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <span className="h-10 w-10 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full font-semibold">
              {selectedTopic.id}
            </span>
            <h2 className="text-2xl font-bold text-gray-800">
              {selectedTopic.title}
            </h2>
          </div>

          <div className="space-y-6">
            {topicSteps.map((step, index) => (
              <div
                key={step.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-medium text-sm">
                        {index + 1}
                      </span>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {step.title}
                      </h3>
                    </div>
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                      {step.duration}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed pl-11">
                    {step.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto text-center py-16">
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Select a Topic to Start Learning
            </h3>
            <p className="text-gray-600">
              Choose a topic from the sidebar to view its content and begin your
              learning journey.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
