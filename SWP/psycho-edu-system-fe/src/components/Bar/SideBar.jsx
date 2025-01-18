import React, { useState } from "react";

const SideBar = ({
  items,
  className = "",
  currentPath = "/",
  title,
  onItemClick,
  collapsible = false,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`${
        isCollapsed ? "w-16" : "w-64"
      } bg-white shadow-lg h-screen fixed left-0 p-4 transition-all duration-300 ${className}`}
    >
      {title && (
        <div className="mb-6 flex items-center justify-between">
          {!isCollapsed && <h2 className="text-xl font-semibold">{title}</h2>}
          {collapsible && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              {isCollapsed ? "→" : "←"}
            </button>
          )}
        </div>
      )}

      <nav className="space-y-2">
        {items.map((item) => {
          const isActive = currentPath === item.href;
          const Icon = item.icon;

          return (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => {
                if (onItemClick) {
                  e.preventDefault();
                  onItemClick(item);
                }
              }}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200
                ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }
                ${
                  item.disabled
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }
              `}
            >
              {Icon && <Icon className="w-5 h-5" />}
              {!isCollapsed && (
                <>
                  <span className="font-medium">{item.name}</span>
                  {item.badge && (
                    <span className="ml-auto bg-blue-100 text-blue-600 px-2 py-1 text-xs rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </a>
          );
        })}
      </nav>
    </div>
  );
};

export default SideBar;
