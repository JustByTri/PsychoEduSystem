import React, { useState, useEffect } from "react";
import apiService from "../../services/apiService";
import BlogCard from "./BlogCard";
import { motion } from "framer-motion";
import { Parallax } from "react-parallax";
import ParticlesBackground from "../ParticlesBackground";

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await apiService.blog.fetchBlogs();
        if (response.isSuccess) {
          setBlogs(response.result);
        } else {
          setError("Cannot load blog posts");
        }
      } catch (err) {
        setError("An error occurred while loading blog posts");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="py-20 bg-white text-navy-blue-900 relative overflow-hidden"
    >
      {/* Particles Background */}
      <ParticlesBackground />

      {/* Parallax Background Decorations */}
      <Parallax strength={300} className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-navy-blue-900 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-400 rounded-full blur-3xl"></div>
      </Parallax>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-extrabold tracking-tight text-navy-blue-900">
            Explore Mental Health
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto font-light">
            Stories, experiences, and tips to help you shine in your school
            journey.
          </p>
        </motion.div>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.3,
              },
            },
          }}
        >
          {blogs.map((blog, index) => (
            <BlogCard key={blog.id} blog={blog} index={index} />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BlogSection;
