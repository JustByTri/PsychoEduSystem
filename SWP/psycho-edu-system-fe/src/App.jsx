import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/main/HomePage";
import MainLayout from "./components/Layouts/MainLayout";
import NotFoundPage from "./pages/error/NotFoundPage";
import ProgramCoursePage from "./pages/student/ProgramPage";
import PortalLayout from "./components/Layouts/PortalLayout";
import Dashboard from "./pages/student/Dashboard";
import StartUpPage from "./pages/student/StartUpPage";
import SurveyPage from "./pages/student/SurveyPage";
function App() {
  return (
    <Router>
      <Routes>
        {/* Main Layout */}
        <Route path="/" element={<MainLayout />}>
          {/* Nested Routes */}
          <Route index element={<HomePage />} />
        </Route>
        {/* Student */}
        <Route path="student/" element={<PortalLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="start-up-survey" element={<StartUpPage />} />
          <Route path="program" element={<ProgramCoursePage />} />
          <Route path="survey-for-student" element={<SurveyPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
