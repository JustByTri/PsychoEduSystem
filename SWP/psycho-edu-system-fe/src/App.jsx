import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/auth/AuthContext";
import ProtectedRoute from "./context/auth/ProtectedRoute";
import "./App.css";
import HomePage from "./pages/main/HomePage";
import MainLayout from "./components/Layouts/MainLayout";
import NotFoundPage from "./pages/error/NotFoundPage";
import ProgramCoursePage from "./pages/student/ProgramPage";
import PortalLayout from "./components/Layouts/PortalLayout";
import Dashboard from "./pages/student/Dashboard";
import StartUpPage from "./pages/student/StartUpPage";
import SurveyPage from "./pages/student/SurveyPage";
import SurveyResultPage from "./pages/student/SurveyResultPage";
import BookingPage from "./pages/booking/BookingPage";
import SchedulePage from "./pages/student/SchedulePage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPortalLayout from "./components/Layouts/AdminPortalLayout";
import SurveyList from "./pages/admin/survey/SurveyList";
import SurveyDetail from "./pages/admin/survey/SurveyDetail";
import RequireSurvey from "./components/Survey/RequireSurvey";
import ParentLayout from "./components/Layouts/ParentLayout";
import ParentDashboard from "./pages/parent/Dashboard";
import ParentSurveyPage from "./pages/parent/SurveyPage";
import TeacherDashboard from "./pages/teacher/Dashboard";
import ClassDetails from "./pages/teacher/ClassDetails";
import SurveyResult from "./pages/survey/SurveyResult";
import ParentSchedulePage from "./pages/parent/ParentSchedulePage";
import { BookingProvider } from "./context/BookingContext";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
          </Route>

          {/* Student Routes */}
          <Route element={<ProtectedRoute allowedRoles={["Student"]} />}>
            {/* Route riêng cho StartUpPage, không bị RequireSurvey chặn */}
            <Route path="student/start-up-survey" element={<StartUpPage />} />
            <Route path="student/survey-for-student" element={<SurveyPage />} />
            {/* Các route yêu cầu kiểm tra khảo sát */}
            <Route element={<RequireSurvey />}>
              <Route path="student/" element={<PortalLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="program" element={<ProgramCoursePage />} />
                <Route path="booking" element={<BookingPage />} />
                <Route path="schedule" element={<SchedulePage />} />
              </Route>
            </Route>
          </Route>
          <Route path="survey-result" element={<SurveyResultPage />} />
          <Route element={<ProtectedRoute allowedRoles={["Parent"]} />}>
            <Route path="parent/" element={<ParentLayout />}>
              <Route index element={<ParentDashboard />} />
              <Route
                path="schedule"
                element={
                  <BookingProvider>
                    <ParentSchedulePage />
                  </BookingProvider>
                }
              />
              <Route path="booking" element={<BookingPage />} />
            </Route>
          </Route>
          <Route path="survey/:childId" element={<ParentSurveyPage />} />
          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
            <Route path="admin/" element={<AdminPortalLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="survey" element={<SurveyList />} />
              <Route path="survey/:id" element={<SurveyDetail />} />
            </Route>
          </Route>
          <Route
            path="overall-survey-result/:studentId"
            element={<SurveyResult />}
          />
          {/* Counselor Routes */}
          <Route element={<ProtectedRoute allowedRoles={["Counselor"]} />}>
            <Route
              path="counselor-dashboard"
              element={<div>Counselor Dashboard</div>}
            />
          </Route>

          {/* Teacher Routes */}
          <Route element={<ProtectedRoute allowedRoles={["Teacher"]} />}>
            <Route path="teacher/" element={<ParentLayout />}>
              <Route index element={<TeacherDashboard />} />
              <Route path="class/:classId" element={<ClassDetails />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
