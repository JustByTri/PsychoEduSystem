const CourseContent = ({ selectedTopic, onTopicSelect, topics }) => {
  return (
    <div className="w-full lg:w-1/4 bg-gray-50 p-6 min-h-screen border-r border-gray-200 overflow-y-auto">
      {/* Header Section */}
      <div className="sticky top-0 bg-gray-50 pb-4 z-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Course Topics</h2>
        <p className="text-sm text-gray-600 mb-4">
          {topics.length} topics in this course
        </p>
        <div className="h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
      </div>

      {/* Topics List */}
      <div className="space-y-3 mt-6">
        {topics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => onTopicSelect(topic)}
            className={`w-full group transition-all duration-200 ease-in-out ${
              selectedTopic?.id === topic.id
                ? "bg-blue-50 border-blue-500"
                : "hover:bg-gray-100 border-transparent"
            } border-l-4 p-4 rounded-r-lg`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Topic Number Circle */}
                <span
                  className={`flex items-center justify-center h-8 w-8 rounded-full text-sm font-medium ${
                    selectedTopic?.id === topic.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-600 group-hover:bg-gray-300"
                  }`}
                >
                  {topic.id}
                </span>
                {/* Topic Title */}
                <div className="flex flex-col text-left">
                  <span
                    className={`font-medium ${
                      selectedTopic?.id === topic.id
                        ? "text-blue-600"
                        : "text-gray-700"
                    }`}
                  >
                    {topic.title}
                  </span>
                  <span className="text-sm text-gray-500">
                    {topic.steps?.length || 0} steps ·{" "}
                    {topic.duration || "15 mins"}
                  </span>
                </div>
              </div>
              {/* Progress Indicator */}
              <div className="h-2 w-2 rounded-full bg-green-500 hidden group-hover:block"></div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CourseContent;
