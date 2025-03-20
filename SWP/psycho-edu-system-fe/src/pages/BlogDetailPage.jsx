import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import apiService from "../services/apiService";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faShareAlt } from "@fortawesome/free-solid-svg-icons";

const BlogDetailPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await apiService.blog.fetchBlogById(id);
        if (response.isSuccess) setBlog(response.result);
        else setError("Cannot load blog post");
      } catch (err) {
        setError("An error occurred while loading the blog post");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) return <p className="text-center text-[#666]">Loading...</p>;
  if (error) return <p className="text-center text-[#FF6F61]">{error}</p>;
  if (!blog)
    return <p className="text-center text-[#666]">Blog post not found</p>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-[#F7FAFC] text-[#26A69A]"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-6"
        >
          <nav className="flex items-center space-x-2 text-sm font-medium">
            <Link
              to="/"
              className="text-[#26A69A] hover:text-[#50eea4d2] transition-colors duration-300 no-underline"
            >
              Home
            </Link>
            <span className="text-[#666]">/</span>
            <span className="text-[#374151]">{blog.title}</span>
          </nav>
        </motion.div>
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative rounded-lg overflow-hidden shadow-md border border-[#E5E7EB]"
          style={{ boxShadow: "0px 4px 20px rgba(38, 166, 154, 0.2)" }}
        >
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className="w-full h-[400px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6">
            <span className="inline-block bg-[#26A69A] text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
              {blog.category}
            </span>
            <h1
              className="text-3xl md:text-4xl font-bold text-white leading-tight"
              style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)" }}
            >
              {blog.title}
            </h1>
            <p className="mt-2 text-sm text-[#D1D5DB]">{blog.createdAt}</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-10 bg-white rounded-lg shadow-md p-8 border border-[#E5E7EB]"
          style={{ boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)" }}
        >
          <div
            className="prose prose-lg max-w-none text-[#374151] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-8 flex justify-between items-center"
        >
          <Link
            to="/"
            className="flex items-center text-[#FBBF24] hover:text-[#c9e559e3] font-semibold transition-colors duration-300 no-underline"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          <button className="flex items-center text-[#26A69A] hover:text-[#FF6F61] font-semibold transition-colors duration-300">
            <FontAwesomeIcon icon={faShareAlt} className="w-5 h-5 mr-2" />
            Share
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BlogDetailPage;
