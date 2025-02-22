import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/main/HomePage";
import MainLayout from "./components/Layouts/MainLayout";
import SurveyPage from "./pages/survey/SurveyPage";
import NotFoundPage from "./pages/error/NotFoundPage";
import ParentPortal from "./pages/parent/ParentPortal";
import CoursePage from "./pages/student/CoursePage";
import PrivateRoute from "./components/Authentication/PrivateRoute";
import AdminPortal from "./pages/admin/AdminPortal";
import CounselorPortal from "./pages/counselor/CounselorPortal";
import StudentPortal from "./pages/student/StudentPortal";
import StudentProgramPage from "./pages/student/StudentProgramPage";
import StudentProgramDetail from "./pages/student/StudentProgramDetail";
import StudentSurveyPage from './pages/survey/StudentSurveyPage';
import StudentSurveyQuestion from './pages/survey/StudentSurveyQuestion';
import SurveyDetailsPage from "./pages/student/SurveyDetailsPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Layout */}
        <Route path="/" element={<MainLayout />}>
          {/* Nested Routes */}
          <Route index element={<HomePage />} />
          <Route path="/survey" element={<SurveyPage />} />
          <Route path="/course/*" element={<CoursePage />} />
        </Route>

        {/* Protected Routes */}
        <Route path="/admin" element={<AdminPortal />} />
        <Route path="/counselor" element={<CounselorPortal />} />
        <Route path="/parent" element={<ParentPortal />} />

        <Route path="/students" element={<PrivateRoute><StudentPortal /></PrivateRoute>} />
        <Route path="/students/program" element={ <PrivateRoute> <StudentProgramPage /> </PrivateRoute> } />
        <Route path="/students/program/:id" element={
          <PrivateRoute>
            <StudentProgramDetail />
          </PrivateRoute>
        } />
        <Route path="/students/survey" element={<PrivateRoute> <StudentSurveyPage /> </PrivateRoute>} />
        <Route path="/students/survey/questions" element={<PrivateRoute> <StudentSurveyQuestion /> </PrivateRoute>} />
        <Route path="/students/survey/details" element={<PrivateRoute> <SurveyDetailsPage /> </PrivateRoute>} />

        {/* Other Routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
