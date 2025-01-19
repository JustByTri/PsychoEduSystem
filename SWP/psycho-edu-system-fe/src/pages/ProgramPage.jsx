import React, { useState } from "react";
import {
  BookOpen,
  PlayCircle,
  Users,
  Star,
  Airplay,
  AlignCenter,
  LucideShoppingBasket,
} from "lucide-react";

import { courseCatalogData, courseListData } from "../data/courseData";
import CourseCatalog from "../components/ProgramPageComponents/CourseCatalog";
import CourseList from "../components/ProgramPageComponents/CoursesList";
import SideBar from "../components/Bar/SideBar";

const ProgramCoursePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCounselor, setSelectedCounselor] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [currentPage, setCurrentPage] = useState("/program"); // State quản lý trang hiện tại

  // Config menu items cho sidebar
  const courseNavigationItems = [
    {
      name: "Home",
      href: "/course/overview",
      icon: BookOpen,
    },
    {
      name: "Survey",
      href: "",
      icon: PlayCircle,
    },
    {
      name: "Program",
      href: "/program",
      icon: Users,
    },
    {
      name: "Account",
      href: "/a",
      icon: Airplay,
    },
    {
      name: "History",
      href: "/b",
      icon: AlignCenter,
    },
    {
      name: "Report",
      href: "/c",
      icon: LucideShoppingBasket,
    },
  ];

  // Lọc danh sách khóa học dựa trên các điều kiện
  const filteredCourses = courseListData.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || course.category === selectedCategory;
    const matchesCounselor =
      selectedCounselor === "All" || course.counselor === selectedCounselor;
    const matchesType = selectedType === "All" || course.type === selectedType;
    return matchesSearch && matchesCategory && matchesCounselor && matchesType;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* 
  - min-h-screen: Đặt chiều cao tối thiểu bằng 100% chiều cao màn hình
  - bg-white: Đặt màu nền trắng cho container
  */}

      <div className="">
        <div className="flex flex-col lg:flex-row">
          {/* 
    - flex: Sử dụng flexbox layout
    - flex-col: Xếp các items theo chiều dọc (column) trên mobile
    - lg:flex-row: Khi màn hình lớn hơn breakpoint lg (1024px),
      chuyển sang xếp items theo chiều ngang (row)
    */}
          {/* Sidebar component với các menu items */}
          <SideBar
            items={courseNavigationItems}
            title="Course Catalog"
            currentPath={currentPage}
            onItemClick={(item) => {
              setCurrentPage(item.href);
            }}
          />

          {/* Component danh mục khóa học */}
          <CourseCatalog
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            categories={courseCatalogData}
          />
          {/* Component danh sách khóa học */}
          <CourseList
            searchTerm={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            courses={filteredCourses}
            selectedCounselor={selectedCounselor}
            selectedType={selectedType}
            onCounselorChange={(e) => setSelectedCounselor(e.target.value)}
            onTypeChange={(e) => setSelectedType(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgramCoursePage;
