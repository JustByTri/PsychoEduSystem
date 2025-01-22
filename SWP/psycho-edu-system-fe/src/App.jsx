import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/main/HomePage";
import MainLayout from "./components/Layouts/MainLayout";
import SurveyPage from "./pages/survey/SurveyPage";
import NotFoundPage from "./pages/error/NotFoundPage";
import PortalPage from "./pages/counselor/PortalPage";
import CoursePage from "./pages/student/CoursePage";

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
        <Route path="*" element={<NotFoundPage />} />
        <Route path="counselor" element={<PortalPage />} />
      </Routes>
    </Router>
  );
}

export default App;
