import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/main/HomePage";
import MainLayout from "./components/Layouts/MainLayout";
import NotFoundPage from "./pages/error/NotFoundPage";
import PortalPage from "./pages/counselor/PortalPage";
import ProgramCoursePage from "./pages/student/ProgramPage";

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
        <Route path="*" element={<NotFoundPage />} />
        <Route path="counselor" element={<PortalPage />} />
      </Routes>
    </Router>
  );
}

export default App;
