import React, { useState } from "react";
import { BookOpen, PlayCircle, Users, Star } from "lucide-react";

import { courseCatalogData, courseListData } from "../data/courseData";
import CourseCatalog from "../components/ProgramPageComponents/CourseCatalog";
import CourseList from "../components/ProgramPageComponents/CoursesList";
import SideBar from "../components/Bar/SideBar";

const ProgramCoursePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCounselor, setSelectedCounselor] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [currentPage, setCurrentPage] = useState("/program");
  const courseNavigationItems = [
    {
      name: "Tổng quan khóa học",
      href: "/course/overview",
      icon: BookOpen,
    },
    {
      name: "Bài giảng",
      href: "/course/lessons",
      icon: PlayCircle,
      badge: "12",
    },
    {
      name: "Học viên",
      href: "/course/students",
      icon: Users,
    },
    {
      name: "Đánh giá",
      href: "/course/reviews",
      icon: Star,
    },
  ];

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
  console.log(courseNavigationItems);
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row">
          <CourseCatalog
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            categories={courseCatalogData}
          />
          <CourseList
            searchTerm={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            courses={filteredCourses}
            selectedCounselor={selectedCounselor}
            selectedType={selectedType}
            onCounselorChange={(e) => setSelectedCounselor(e.target.value)}
            onTypeChange={(e) => setSelectedType(e.target.value)}
          />
          <SideBar
            items={courseNavigationItems}
            title="Quản lý khóa học"
            currentPath={currentPage}
            onItemClick={(item) => {
              setCurrentPage(item.href);
            }}
            collapsible={false}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgramCoursePage;
