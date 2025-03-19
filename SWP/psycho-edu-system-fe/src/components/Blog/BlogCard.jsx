import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const BlogCard = ({ blog, index }) => {
  const tiltVariants = {
    hidden: { opacity: 0, rotateY: 30, y: 50 },
    visible: {
      opacity: 1,
      rotateY: 0,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    hover: {
      rotateY: 10,
      scale: 1.05,
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
      transition: { duration: 0.2, ease: "easeInOut" }, // Giảm thời gian transition
    },
  };

  return (
    <motion.div
      variants={tiltVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={`relative bg-white rounded-2xl overflow-hidden shadow-xl transform transition-all duration-200 ease-in-out ${
        index % 2 === 0 ? "rotate-2" : "-rotate-2"
      }`} // Giảm duration và thêm ease-in-out
    >
      <div className="relative">
        <img
          src={blog.thumbnail}
          alt={blog.title}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute top-4 left-4 bg-navy-blue-900 text-white text-xs font-semibold px-4 py-1 rounded-full">
          {blog.category}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-navy-blue-900 line-clamp-2 leading-tight">
          {blog.title}
        </h3>
        <p className="mt-3 text-gray-600 line-clamp-3 text-sm">
          {blog.excerpt}
        </p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm text-gray-500">{blog.createdAt}</span>
          <Link
            to={`/blog/${blog.id}`}
            className="text-green-600 font-semibold hover:text-green-500 transition-colors duration-200"
          >
            Explore →
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogCard;
