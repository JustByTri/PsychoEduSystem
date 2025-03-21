import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const BlogCard = ({ blog, index }) => {
  const tiltVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    hover: {
      scale: 1.05,
      boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.15)",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  return (
    <motion.div
      variants={tiltVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="bg-white rounded-lg overflow-hidden shadow-md border border-[#E5E7EB] transition-all duration-300"
    >
      <div className="relative">
        <img
          src={blog.thumbnail}
          alt={blog.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute top-3 left-3 bg-[#26A69A] text-white text-xs font-semibold px-3 py-1 rounded-full">
          {blog.category}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-[#26A69A] line-clamp-2 leading-tight">
          {blog.title}
        </h3>
        <p className="mt-2 text-[#374151] line-clamp-2 text-sm">
          {blog.excerpt}
        </p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm text-[#666]">{blog.createdAt}</span> 
          <Link
            to={`/blog/${blog.id}`}
            className="text-[#FF6F61] font-semibold hover:text-[#fe0000] transition-colors duration-300 no-underline"
          >
            Explore →
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogCard;
