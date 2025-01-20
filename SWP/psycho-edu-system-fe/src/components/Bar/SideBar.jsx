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
          isCollapsed ? "w-[80px]" : "w-[250px]"
        } // Điều chỉnh độ rộng khi thu gọn
         ${className}
        bg-white h-screen shadow-lg left-0 border-r
        flex flex-col // Sử dụng flexbox để căn chỉnh nội dung
        transition-all duration-300 ease-in-out // Animation mượt mà khi thu gọn
      `}
    >
      {/* Header của sidebar */}
      <div className="flex items-center p-4 border-b">
        {!isCollapsed && <span className="text-xl font-semibold">{title}</span>}
        <button
          onClick={onCollapse}
          className="p-2 hover:bg-gray-100 rounded-lg ml-auto"
          title={isCollapsed ? "Mở rộng" : "Thu gọn"}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Menu items */}
      <nav className="p-3 space-y-2">
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
              {Icon && <Icon size={20} />}

              {/* Text và badge chỉ hiển thị khi không thu gọn */}
              {!isCollapsed && (
                <>
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 text-xs rounded-full">
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
