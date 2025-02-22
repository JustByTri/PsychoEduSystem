import React from "react";
import { Home, MessageCircle, Calendar, User, History, BookOpen, FileText } from "lucide-react";

const AuthSideBar = () => {
  const menuItems = [
    {
      icon: Home,
      label: "Home",
      href: "/auth"
    },
    {
      icon: MessageCircle,
      label: "Survey",
      href: "/auth/surveys"
    },
    {
      icon: Calendar,
      label: "Program",
      href: "/auth/programs"
    },
    {
      icon: User,
      label: "Account",
      href: "/auth/account"
    },
    {
      icon: History,
      label: "History",
      href: "/auth/history"
    },
    {
      icon: FileText,
      label: "Report",
      href: "/auth/reports"
    }
  ];

  return (
    <div className="h-[calc(100vh-64px)] w-[100px] bg-[#65CCB8] flex flex-col justify-between">
      {/* Menu Items */}
      <div className="flex flex-col items-center pt-6 space-y-8">
        {menuItems.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className="flex flex-col items-center text-white hover:opacity-80 transition-opacity w-full px-2"
          >
            <item.icon size={28} strokeWidth={1.5} className="text-[#000000]" />
            <span className="text-sm mt-2">{item.label}</span>
          </a>
        ))}
      </div>

      {/* Copyright Footer */}
      <div className="pb-4 text-center">
        <span className="text-white text-xs">Copyright FPTU©</span>
      </div>
    </div>
  );
};

export default AuthSideBar;
