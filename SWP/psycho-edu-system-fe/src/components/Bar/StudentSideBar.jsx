import React from "react";
import { Link } from "react-router-dom";
import { Home, MessageCircle, Calendar, User, History, BookOpen, FileText } from "lucide-react";

const StudentSideBar = () => {
  const menuItems = [
    {
      icon: Home,
      label: "Home",
      href: "/student"
    },
    {
      icon: MessageCircle,
      label: "Survey",
      href: "/student/survey"
    },
    {
      icon: Calendar,
      label: "Program",
      href: "/student/program"
    },
    {
      icon: User,
      label: "Account",
      href: "/student/account"
    },
    {
      icon: History,
      label: "History",
      href: "/student/history"
    },
    {
      icon: BookOpen,
      label: "Course",
      href: "/student/course"
    },
    {
      icon: FileText,
      label: "Report",
      href: "/student/report"
    }
  ];

  return (
    <div className="flex flex-col justify-between h-screen bg-[#A8E0D6] w-20 fixed left-0 top-0">
      {/* Logo */}
      <div className="flex justify-center pt-4">
        <img src="/path-to-your-logo.png" alt="Logo" className="w-12 h-12" />
      </div>

      {/* Menu Items */}
      <div className="flex flex-col items-center pt-6 space-y-6">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.href}
            className="flex flex-col items-center text-[#000000] hover:opacity-80 transition-opacity w-full px-2"
          >
            <item.icon size={28} strokeWidth={1.5} className="text-[#000000]" />
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Copyright Footer */}
      <div className="pb-4 text-center">
        <span className="text-white text-xs">Copyright FPTU©</span>
      </div>
    </div>
  );
};

export default StudentSideBar;