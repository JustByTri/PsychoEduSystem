import React, { useState, useEffect } from "react";
import apiService from "../../services/apiService";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeading,
  faImage,
  faFileAlt,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const BlogForm = ({ blog, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    thumbnail: "",
    excerpt: "",
    content: "",
    category: "",
  });

  useEffect(() => {
    if (blog) setFormData(blog);
  }, [blog]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleContentChange = (value) => {
    setFormData({ ...formData, content: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.thumbnail ||
      !formData.excerpt ||
      !formData.content ||
      !formData.category
    ) {
      toast.error("Please fill in all fields!");
      return;
    }
    try {
      if (blog) {
        const response = await apiService.blog.updateBlog(blog.id, formData);
        if (response.isSuccess) {
          toast.success(response.message);
          onSave();
        }
      } else {
        const response = await apiService.blog.createBlog(formData);
        if (response.isSuccess) {
          toast.success(response.message);
          onSave();
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto border border-[#E5E7EB]"
    >
      <h3 className="text-2xl font-bold text-[#26A69A] mb-6">
        {blog ? "Edit Blog Post" : "Create New Blog Post"}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#374151] mb-2">
            <FontAwesomeIcon icon={faHeading} className="mr-2 text-[#26A69A]" />
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter the blog title..."
            className="block w-full border border-[#E5E7EB] rounded-lg p-3 focus:ring-2 focus:ring-[#26A69A] focus:border-[#26A69A] transition-all duration-300 shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#374151] mb-2">
            <FontAwesomeIcon icon={faImage} className="mr-2 text-[#26A69A]" />
            Image (URL)
          </label>
          <input
            type="text"
            name="thumbnail"
            value={formData.thumbnail}
            onChange={handleChange}
            placeholder="Paste the image URL..."
            className="block w-full border border-[#E5E7EB] rounded-lg p-3 focus:ring-2 focus:ring-[#26A69A] focus:border-[#26A69A] transition-all duration-300 shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#374151] mb-2">
            <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-[#26A69A]" />
            Excerpt
          </label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            placeholder="Enter a short excerpt (2-3 sentences)..."
            className="block w-full border border-[#E5E7EB] rounded-lg p-3 focus:ring-2 focus:ring-[#26A69A] focus:border-[#26A69A] transition-all duration-300 shadow-sm"
            rows="3"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#374151] mb-2">
            <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-[#26A69A]" />
            Content
          </label>
          <ReactQuill
            value={formData.content}
            onChange={handleContentChange}
            className="bg-white rounded-lg shadow-sm"
            theme="snow"
            modules={{
              toolbar: [
                [{ header: [1, 2, false] }],
                ["bold", "italic", "underline"],
                ["link", "image"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["clean"],
              ],
            }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#374151] mb-2">
            <FontAwesomeIcon icon={faList} className="mr-2 text-[#26A69A]" />
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="block w-full border border-[#E5E7EB] rounded-lg p-3 focus:ring-2 focus:ring-[#26A69A] focus:border-[#26A69A] transition-all duration-300 shadow-sm"
            required
          >
            <option value="">Select a category</option>
            <option value="Lo Âu">Lo Âu</option>
            <option value="Trầm Cảm">Trầm Cảm</option>
            <option value="Cognitive Health">Cognitive Health</option>
            <option value="Emotional Health">Emotional Health</option>
            <option value="Social Health">Social Health</option>
            <option value="Physical Health">Physical Health</option>
            <option value="School Stories">School Stories</option>
          </select>
        </div>
        <div className="flex space-x-4 pt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-[#26A69A] text-white px-6 py-2 rounded-lg hover:bg-[#4DB6AC] transition-all duration-300 shadow-md"
          >
            {blog ? "Update" : "Create"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={onCancel}
            className="bg-[#FF6F61] text-white px-6 py-2 rounded-lg hover:bg-[#FF8A80] transition-all duration-300 shadow-md"
          >
            Cancel
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default BlogForm;
