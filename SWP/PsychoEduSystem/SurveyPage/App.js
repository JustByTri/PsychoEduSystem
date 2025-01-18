import "./App.css";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Chat from "../src/components/Chat";
import Survey from "../src/components/survey";
import StartSurvey from "../src/components/StartSurvey";
import SkipSurvey from "../src/components/SkipSurvey";
import SignUp from "../src/components/Signup";
import Login from "../src/components/Login";
import Contact from "../src/components/Contact";
import About from "../src/components/about";

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="app-nav">
          <ul className="app-nav-list">
            <li className="app-nav-item"><Link to="/">Chat</Link></li>
            <li className="app-nav-item"><Link to="/survey">Survey</Link></li>
            <li className="app-nav-item"><Link to="/start-survey">Start Survey</Link></li>
            <li className="app-nav-item"><Link to="/skip-survey">Skip Survey</Link></li>
            <li className="app-nav-item"><Link to="/signup">Sign Up</Link></li>
            <li className="app-nav-item"><Link to="/login">Login</Link></li>
            <li className="app-nav-item"><Link to="/contact">Contact</Link></li>
            <li className="app-nav-item"><Link to="/about">About</Link></li>
          </ul>
        </nav>
        <Switch>
          <Route path="/" exact component={Chat} />
          <Route path="/survey" component={Survey} />
          <Route path="/start-survey" component={StartSurvey} />
          <Route path="/skip-survey" component={SkipSurvey} />
          <Route path="/signup" component={SignUp} />
          <Route path="/login" component={Login} />
          <Route path="/contact" component={Contact} />
          <Route path="/about" component={About} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
