import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/auth/AuthContext";
import ProtectedRoute from "./context/auth/ProtectedRoute";
import "./App.css";
import HomePage from "./pages/main/HomePage";
import MainLayout from "./components/Layouts/MainLayout";
import NotFoundPage from "./pages/error/NotFoundPage";
import ProgramCoursePage from "./pages/student/CoursePage";
import PortalLayout from "./components/Layouts/PortalLayout";
import Dashboard from "./pages/student/Dashboard";
import StartUpPage from "./pages/student/StartUpPage";
import SurveyPage from "./pages/student/SurveyPage";
import SurveyResultPage from "./pages/student/SurveyResultPage";
import BookingPage from "./pages/booking/BookingPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPortalLayout from "./components/Layouts/AdminPortalLayout";
import SurveyList from "./pages/admin/survey/SurveyList";
import SurveyDetail from "./pages/admin/survey/SurveyDetail";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
          </Route>

          {/* Student Routes */}
          <Route
            element={<ProtectedRoute allowedRoles={["Student", "Parent"]} />}
          >
            <Route path="student/" element={<PortalLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="start-up-survey" element={<StartUpPage />} />
              <Route path="program" element={<ProgramCoursePage />} />
              <Route path="survey-for-student" element={<SurveyPage />} />
              <Route path="survey-result" element={<SurveyResultPage />} />
            </Route>
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
            <Route path="admin/" element={<AdminPortalLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="survey" element={<SurveyList />} />
              <Route path="survey/:id" element={<SurveyDetail />} />
            </Route>
          </Route>

          {/* Counselor Routes */}
          <Route element={<ProtectedRoute allowedRoles={["Counselor"]} />}>
            <Route
              path="counselor-dashboard"
              element={<div>Counselor Dashboard</div>}
            />
          </Route>

          {/* Teacher Routes */}
          <Route element={<ProtectedRoute allowedRoles={["Teacher"]} />}>
            <Route
              path="teacher-dashboard"
              element={<div>Teacher Dashboard</div>}
            />
          </Route>

          <Route path="booking/" element={<BookingPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
