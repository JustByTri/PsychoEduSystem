import React, { useState } from "react";
import apiService from "../../services/apiService";
import { toast } from "react-toastify";

const BlogForm = ({ blog, dimensions, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: blog?.title || "",
    content: blog?.content || "",
    dimensionId: blog?.dimensionId || dimensions[0]?.id,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data on Submit:", formData);
    try {
      let response;
      if (blog) {
        response = await apiService.blog.updateBlog(blog.id, formData);
      } else {
        response = await apiService.blog.createBlog(formData);
      }
      toast.success(response.message);
      onSave(response.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          placeholder="Enter blog title"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Content
        </label>
        <textarea
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          rows="6"
          placeholder="Write your content here"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          value={formData.dimensionId}
          onChange={(e) =>
            setFormData({ ...formData, dimensionId: e.target.value })
          }
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        >
          {dimensions.map((dim) => (
            <option key={dim.id} value={dim.id}>
              {dim.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex space-x-4">
        <button
          type="submit"
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg shadow-md hover:bg-gray-400 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default BlogForm;
