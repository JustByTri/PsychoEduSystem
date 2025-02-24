import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/auth/AuthContext";
import ProtectedRoute from "./context/auth/ProtectedRoute";
import PrivateRoute from "./components/Authentication/PrivateRoute";
import PortalLayout from "./components/Layouts/PortalLayout";
import "./App.css";
import HomePage from "./pages/main/HomePage";
import MainLayout from "./components/Layouts/MainLayout";
import SurveyPage from "./pages/survey/SurveyPage";
import NotFoundPage from "./pages/error/NotFoundPage";
import BookingPage from "./pages/booking/BookingPage";
//StudentPage
import StudentPortal from "./pages/student/StudentPortal";
import CoursePage from "./pages/student/CoursePage";
import StudentProgramPage from "./pages/student/StudentProgramPage";
import StudentProgramDetail from "./pages/student/StudentProgramDetail";
import StudentSurveyPage from './pages/survey/StudentSurveyPage';
import StudentSurveyQuestion from './pages/survey/StudentSurveyQuestion';
import SurveyDetailsPage from "./pages/student/SurveyDetailsPage";
//thinh
import ProgramCoursePage from "./pages/student/ProgramPage";
import Dashboard from "./pages/student/Dashboard";
import StartUpPage from "./pages/student/StartUpPage";
import SurveyPage from "./pages/student/SurveyPage";
import SurveyResultPage from "./pages/student/SurveyResultPage";
//ParentPage
import ParentPortal from "./pages/parent/ParentPortal";

//AdminPage
import AdminPortalLayout from "./components/Layouts/AdminPortalLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import SurveyList from "./pages/admin/survey/SurveyList";
import SurveyDetail from "./pages/admin/survey/SurveyDetail";
import AdminPortal from "./pages/admin/AdminPortal";

//CounselorPage
import CounselorPortal from "./pages/counselor/CounselorPortal";

//TeacherPage
import TeacherPortal from "./pages/teacher/TeacherPortal";

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

              //HUY
              <Route path="/students" element={<StudentPortal />} />
              <Route path="/students/program" element={ <StudentProgramPage /> } />
              <Route path="/students/program/:id" element={  <StudentProgramDetail /> } />
              <Route path="/students/survey" element={ <StudentSurveyPage /> } />
              <Route path="/students/survey/questions" element={ <StudentSurveyQuestion /> } />
              <Route path="/students/survey/details" element={ <SurveyDetailsPage /> } />
            </Route>
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
            {/*<Route path="/admin" element={<AdminPortal />} />*/}
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
          {/* Student */}
          <Route path="student/" element={<PortalLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="start-up-survey" element={<StartUpPage />} />
            <Route path="program" element={<ProgramCoursePage />} />
            <Route path="survey-for-student" element={<SurveyPage />} />
            <Route path="survey-result" element={<SurveyResultPage />} />
          </Route>
          {/* Admin */}
          <Route path="admin/" element={<AdminPortalLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="survey" element={<SurveyList />} />
            <Route path="survey/:id" element={<SurveyDetail />} />
          </Route>
          <Route path="booking/" element={<BookingPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;