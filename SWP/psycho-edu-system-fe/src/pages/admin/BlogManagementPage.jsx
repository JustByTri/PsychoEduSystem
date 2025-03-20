import React, { useState, useEffect } from "react";
import apiService from "../../services/apiService";
import BlogForm from "../../components/Blog/BlogForm";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { Parallax } from "react-parallax";
import ParticlesBackground from "../../components/ParticlesBackground";

const BlogManagementPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBlogs();
  }, [pageNumber]);

  const fetchBlogs = async () => {
    try {
      const response = await apiService.blog.fetchBlogs(pageNumber, pageSize);
      if (response.isSuccess) {
        setBlogs(response.result);
        setFilteredBlogs(response.result);
        setTotalPages(response.pagination.totalPages);
      } else {
        setError("Cannot load blog posts");
      }
    } catch (err) {
      setError("An error occurred while loading blog posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = blogs;
    if (searchTerm) {
      filtered = filtered.filter((blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterCategory) {
      filtered = filtered.filter((blog) => blog.category === filterCategory);
    }
    setFilteredBlogs(filtered);
  }, [searchTerm, filterCategory, blogs]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        const response = await apiService.blog.deleteBlog(id);
        if (response.isSuccess) {
          toast.success(response.message);
          fetchBlogs();
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleSave = () => {
    setIsFormOpen(false);
    setSelectedBlog(null);
    fetchBlogs();
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="p-6 bg-gray-50 min-h-screen text-navy-blue-900 relative overflow-hidden"
    >
      {/* Particles Background */}
      <ParticlesBackground />

      {/* Parallax Background Decorations */}
      <Parallax strength={300} className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-navy-blue-900 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-500 rounded-full blur-3xl"></div>
      </Parallax>

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-8">
          <motion.h2
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-extrabold text-navy-blue-900"
          >
            Blog Management
          </motion.h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSelectedBlog(null);
              setIsFormOpen(true);
            }}
            className="flex items-center bg-navy-blue-900 text-white px-6 py-3 rounded-lg hover:bg-navy-blue-800 transition-all duration-300 shadow-lg"
          >
            <FontAwesomeIcon icon={faPlus} className="w-5 h-5 mr-2" />
            Add New Post
          </motion.button>
        </div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex space-x-4"
        >
          <div className="relative flex-1">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
            />
            <input
              type="text"
              placeholder="Search blog posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 text-gray-800 placeholder-gray-400"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-white border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 text-gray-800"
          >
            <option value="">All Categories</option>
            <option value="Lo Âu">Lo Âu</option>
            <option value="Trầm Cảm">Trầm Cảm</option>
            <option value="Cognitive Health">Cognitive Health</option>
            <option value="Emotional Health">Emotional Health</option>
            <option value="Social Health">Social Health</option>
            <option value="Physical Health">Physical Health</option>
            <option value="School Stories">School Stories</option>
          </select>
        </motion.div>

        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <BlogForm
              blog={selectedBlog}
              onSave={handleSave}
              onCancel={() => setIsFormOpen(false)}
            />
          </motion.div>
        )}

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Published Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBlogs.map((blog) => (
                <motion.tr
                  key={blog.id}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.3 },
                    },
                  }}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                    {blog.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {blog.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {blog.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setSelectedBlog(blog);
                        setIsFormOpen(true);
                      }}
                      className="text-green-500 hover:text-green-600"
                    >
                      <FontAwesomeIcon icon={faEdit} className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(blog.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <FontAwesomeIcon icon={faTrash} className="w-5 h-5" />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Phân trang */}
        <div className="mt-6 flex justify-center space-x-2">
          <button
            onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
            disabled={pageNumber === 1}
            className="px-4 py-2 bg-[#26A69A] text-white rounded-lg disabled:bg-gray-300"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-[#374151]">
            Page {pageNumber} of {totalPages}
          </span>
          <button
            onClick={() =>
              setPageNumber((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={pageNumber === totalPages}
            className="px-4 py-2 bg-[#26A69A] text-white rounded-lg disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogManagementPage;
