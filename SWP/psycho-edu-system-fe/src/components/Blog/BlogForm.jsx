import React, { useState } from "react";
import apiService from "../../services/apiService";
import { toast } from "react-toastify";

const BlogForm = ({ blog, dimensions, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: blog?.title || "",
    content: blog?.content || "",
    dimensionId: blog?.dimensionId || (dimensions[0]?.id ?? 1),
    thumbnail: blog?.thumbnail || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (blog) {
        await apiService.blog.updateBlog(blog.id, formData);
      } else {
        await apiService.blog.createBlog(formData);
      }
      toast.success("Blog saved successfully");
      onSave();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Content</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          rows="5"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <select
          value={formData.dimensionId}
          onChange={(e) => setFormData({ ...formData, dimensionId: e.target.value })}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          {dimensions.map((dim) => (
            <option key={dim.id} value={dim.id}>
              {dim.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Thumbnail URL</label>
        <input
          type="text"
          value={formData.thumbnail}
          onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="flex space-x-4">
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default BlogForm;