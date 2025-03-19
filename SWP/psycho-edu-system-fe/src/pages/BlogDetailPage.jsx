import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import apiService from "../services/apiService";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faShareAlt } from "@fortawesome/free-solid-svg-icons";
import { Parallax } from "react-parallax";
import ParticlesBackground from "../components/ParticlesBackground";

const BlogDetailPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await apiService.blog.fetchBlogById(id);
        if (response.isSuccess) {
          setBlog(response.result);
        } else {
          setError("Cannot load blog post");
        }
      } catch (err) {
        setError("An error occurred while loading the blog post");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!blog) return <p className="text-center">Blog post not found</p>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative min-h-screen bg-white text-navy-blue-900 overflow-hidden"
    >
      {/* Particles Background */}
      <ParticlesBackground />

      {/* Parallax Background Decorations */}
      <Parallax strength={300} className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-navy-blue-900 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-500 rounded-full blur-3xl"></div>
      </Parallax>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <nav className="flex items-center space-x-2 text-sm font-medium">
            <Link
              to="/"
              className="text-green-500 hover:text-green-500 transition-colors duration-200"
            >
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{blog.title}</span>
          </nav>
        </motion.div>

        {/* Header Image */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative rounded-2xl overflow-hidden shadow-2xl"
        >
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className="w-full h-[500px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute bottom-8 left-8 right-8">
            <span className="inline-block bg-navy-blue-900 text-white text-xs font-semibold px-4 py-1 rounded-full mb-4">
              {blog.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-white">
              {blog.title}
            </h1>
            <p className="mt-3 text-sm text-gray-300">{blog.createdAt}</p>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-12 max-w-3xl mx-auto relative"
        >
          <div className="bg-gray-50 rounded-2xl p-8 shadow-xl text-gray-800">
            <div
              className="prose prose-lg prose-headings:font-bold prose-headings:text-navy-blue-900 prose-p:leading-relaxed prose-p:text-gray-700 prose-a:text-green-500 prose-a:underline prose-img:rounded-lg prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-12 flex justify-between items-center max-w-3xl mx-auto"
        >
          <Link
            to="/"
            className="flex items-center text-green-500 hover:text-green-500 transition-colors duration-200 font-medium"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5 mr-2" />
            Back
          </Link>
          <button className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200 font-medium">
            <FontAwesomeIcon icon={faShareAlt} className="w-5 h-5 mr-2" />
            Share
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BlogDetailPage;
