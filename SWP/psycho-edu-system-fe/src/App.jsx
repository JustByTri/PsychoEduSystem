import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/main/HomePage";
import MainLayout from "./components/Layouts/MainLayout";
import ProgramPage from "./pages/ProgramPage";
import SurveyPage from "./pages/survey/SurveyPage";
function App() {
  return (
    <Router>
      <Routes>
        {/* Main Layout */}
        <Route path="/" element={<MainLayout />}>
          {/* Nested Routes */}
          <Route index element={<HomePage />} />
          <Route path="/program" element={<ProgramPage />} />
          <Route path="/survey" element={<SurveyPage/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
