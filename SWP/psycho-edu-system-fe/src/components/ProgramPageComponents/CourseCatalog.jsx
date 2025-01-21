// import React from "react";

// const CourseCatalog = ({ selectedCategory, onCategorySelect, categories }) => {
//   return (
//     <div className="w-full lg:w-1/4 bg-gray-50 p-6 min-h-screen border-r border-gray-200">
//       <h2 className="text-xl font-semibold mb-4">Categories</h2>
//       <div className="space-y-2">
//         <button
//           onClick={() => onCategorySelect(null)}
//           className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
//             selectedCategory === null
//               ? "bg-blue-500 text-white"
//               : "hover:bg-gray-100"
//           }`}
//         >
//           <span>All Courses</span>
//           <span className="float-right bg-gray-200 text-gray-600 px-2 rounded-full text-sm">
//             {categories.reduce((total, cat) => total + cat.count, 0)}
//           </span>
//         </button>
//         {categories.map((category) => (
//           <button
//             key={category.id}
//             onClick={() => onCategorySelect(category.name)}
//             className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
//               selectedCategory === category.name
//                 ? "bg-blue-500 text-white"
//                 : "hover:bg-gray-100"
//             }`}
//           >
//             <span>{category.name}</span>
//             <span className="float-right bg-gray-200 text-gray-600 px-2 rounded-full text-sm">
//               {category.count}
//             </span>
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

const CourseCatalog = ({ selectedCategory, onCategorySelect, categories }) => {
  return (
    <div className="w-full lg:w-80 bg-white rounded-xl shadow-sm p-6 h-fit sticky top-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Categories</h2>
      <div className="space-y-2">
        <button
          onClick={() => onCategorySelect(null)}
          className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between ${
            selectedCategory === null
              ? "bg-blue-500 text-white shadow-md"
              : "hover:bg-gray-50 text-gray-700"
          }`}
        >
          <span className="font-medium">All Courses</span>
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              selectedCategory === null
                ? "bg-blue-400 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {categories.reduce((total, cat) => total + cat.count, 0)}
          </span>
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.name)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between ${
              selectedCategory === category.name
                ? "bg-blue-500 text-white shadow-md"
                : "hover:bg-gray-50 text-gray-700"
            }`}
          >
            <span className="font-medium">{category.name}</span>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                selectedCategory === category.name
                  ? "bg-blue-400 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {category.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CourseCatalog;
