import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/auth/AuthContext";
import ProtectedRoute from "./context/auth/ProtectedRoute";
import PrivateRoute from "./components/Authentication/PrivateRoute";
import PortalLayout from "./components/Layouts/PortalLayout";
import "./App.css";
import HomePage from "./pages/main/HomePage";
import MainLayout from "./components/Layouts/MainLayout";
import NotFoundPage from "./pages/error/NotFoundPage";
import BookingPage from "./pages/booking/BookingPage";
//StudentPage
import StudentPortal from "./pages/student/StudentPortal";
import StudentProgramPage from "./pages/student/StudentProgramPage";
import StudentProgramDetail from "./pages/student/StudentProgramDetail";
import StudentSurveyPage from './pages/survey/StudentSurveyPage';
import StudentSurveyQuestion from './pages/survey/StudentSurveyQuestion';
import SurveyDetailsPage from "./pages/student/SurveyDetailsPage";
import ProgramCoursePage from "./pages/student/ProgramPage";
import Dashboard from "./pages/student/Dashboard";
import StartUpPage from "./pages/student/StartUpPage";
import SurveyPage from "./pages/student/SurveyPage";
import SurveyResultPage from "./pages/student/SurveyResultPage";
//ParentPage
//AdminPage
import AdminPortalLayout from "./components/Layouts/AdminPortalLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import SurveyList from "./pages/admin/survey/SurveyList";
import SurveyDetail from "./pages/admin/survey/SurveyDetail";
import ProgramList from "./pages/admin/program/ProgramLists"; // Fixed case sensitivity
//CounselorPage
//TeacherPage

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
          </Route>

          {/* Student Routes */}
          {/*<Route element={<ProtectedRoute allowedRoles={["Student", "Parent"]} />}>*/}
          <Route>
            <Route path="/student" element={<PortalLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="start-up-survey" element={<StartUpPage />} />
              <Route path="program" element={<ProgramCoursePage />} />
              <Route path="survey-for-student" element={<SurveyPage />} />
              <Route path="survey-result" element={<SurveyResultPage />} />
            </Route>
          </Route>

          //huy
            <Route path="/students" element={<StudentPortal />} />
            <Route path="/students/program" element={<StudentProgramPage />} />
            <Route path="/students/program/:id" element={<StudentProgramDetail />} />
            <Route path="/students/survey" element={<StudentSurveyPage />} />
            <Route path="/students/survey/questions" element={<StudentSurveyQuestion />} />
            <Route path="/students/survey/details" element={<SurveyDetailsPage />} />

          {/* Admin Routes */}
          {/*<Route element={<ProtectedRoute allowedRoles={["Admin"]} />}></Route>*/}
          <Route>
            <Route path="/admin" element={<AdminPortalLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="programs" element={<ProgramList />} />
              <Route path="survey" element={<SurveyList />} />
              <Route path="survey/:id" element={<SurveyDetail />} />
            </Route>
          </Route>

          {/* Other Routes */}
          <Route path="booking/" element={<BookingPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;