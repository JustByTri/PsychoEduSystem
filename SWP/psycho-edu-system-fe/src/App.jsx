import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/main/HomePage";
import MainLayout from "./components/Layouts/MainLayout";
import NotFoundPage from "./pages/error/NotFoundPage";
import ProgramCoursePage from "./pages/student/ProgramPage";
import PortalLayout from "./components/Layouts/PortalLayout";
import Dashboard from "./pages/student/Dashboard";
function App() {
  return (
    <Router>
      <Routes>
        {/* Main Layout */}
        <Route path="/" element={<MainLayout />}>
          {/* Nested Routes */}
          <Route index element={<HomePage />} />
          <Route path="/program/*" element={<ProgramCoursePage />} />
        </Route>
        {/* Student */}
        <Route element={<PortalLayout />}>
          <Route path="student" element={<Dashboard />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
