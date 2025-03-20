import React, { useState, useEffect } from "react";
import apiService from "../../services/apiService";
import BlogCard from "./BlogCard";
import { motion } from "framer-motion";

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await apiService.blog.fetchBlogs();
        if (response.isSuccess) setBlogs(response.result);
        else setError("Cannot load blog posts");
      } catch (err) {
        setError("An error occurred while loading blog posts");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) return <p className="text-center text-[#666]">Loading...</p>;
  if (error) return <p className="text-center text-[#FF6F61]">{error}</p>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="py-16 bg-[#F7FAFC]"
      style={{ boxShadow: "0px 4px 20px rgba(0, 0, 0, 0)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-12"
        >
          <h2
            className="text-4xl font-bold text-[#26A69A]"
            style={{ textShadow: "1px 1px 3px rgba(0, 0, 0, 0.1)" }}
          >
            Latest Insights
          </h2>
          <p className="mt-3 text-lg text-[#374151] max-w-2xl mx-auto">
            Expert advice and stories to support your mental health journey.
          </p>
        </motion.div>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
          }}
        >
          {blogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1 }} // Đồng bộ với Features
              whileTap={{ scale: 1.05 }} // Đồng bộ với Features
              style={{
                transition: "all 0.3s ease", // Transition mượt mà
                border: "1px solid transparent",
              }}
            >
              <BlogCard blog={blog} index={index} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BlogSection;
