import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Import icons cho nút thu gọn

const SideBar = ({
  items, // Danh sách các menu items
  className = "", // Custom classes (optional)
  currentPath = "/", // Đường dẫn hiện tại để highlight item active
  title, // Tiêu đề của sidebar (optional)
  onItemClick, // Callback function khi click vào item
  onCollapse, //Prop để xử lý việc thu gọn
  isCollapsed, // Prop để quản lí trạng thái thu gọn
}) => {
  // State quản lý trạng thái thu gọn của sidebar
  return (
    <div
      className={`
        ${
          isCollapsed ? "w-[80px]" : "w-[200px]"
        } // Điều chỉnh độ rộng khi thu gọn
       
         ${className}
        bg-white h-screen
        flex flex-col // Sử dụng flexbox để căn chỉnh nội dung
        transition-all duration-300 // Animation mượt mà khi thu gọn
        shadow-sm
        border-r border-gray-200
      `}
    >
      {/* Header của sidebar */}
      <div className="flex items-center p-6 border-b border-gray-100">
        {!isCollapsed && (
          <span className="text-xl font-semibold text-gray-800 transition-opacity duration-300">
            {title}
          </span>
        )}
        <button
          onClick={onCollapse}
          className="p-2 hover:bg-gray-50 rounded-lg ml-auto text-gray-600 hover:text-gray-900 transition-colors duration-200"
          title={isCollapsed ? "Mở rộng" : "Thu gọn"}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Menu items */}
      <nav className="flex-1 p-1 space-y-2">
        {items.map((item) => {
          const isActive = currentPath === item.href;
          const Icon = item.icon;

          return (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => {
                if (onItemClick && !item.disabled) {
                  e.preventDefault();
                  onItemClick(item);
                }
              }}
              title={isCollapsed ? item.name : ""} // Hiển thị tooltip khi thu gọn
              className={`
                flex items-center gap-3 p-3 rounded-lg
                transition-all duration-200
                 ${
                   isActive
                     ? "bg-blue-50 text-blue-600"
                     : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                 }
                ${isCollapsed ? "justify-center" : ""}
              `}
            >
              {/* Icon luôn hiển thị */}
              {Icon && (
                <div className="transition-transform duration-200 hover:scale-110">
                  <Icon size={20} />
                </div>
              )}
              {/* Text và badge chỉ hiển thị khi không thu gọn */}
              {!isCollapsed && (
                <div className="flex items-center justify-between flex-1">
                  <span className="font-medium">{item.name}</span>
                  {item.badge && (
                    <span className="px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </a>
          );
        })}
      </nav>
    </div>
  );
};

export default SideBar;
