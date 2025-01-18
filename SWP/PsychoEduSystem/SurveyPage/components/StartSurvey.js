import React, { useState } from 'react';
import './startSurvey.css';

const StartSurvey = () => {
  const [started, setStarted] = useState(false);

  const startSurvey = () => {
    // Add logic to start the survey
    console.log("Survey started!");
    setStarted(true);
  };

  return (
    <div className="start-survey-container">
      <h2>Start Survey</h2>
      <button onClick={startSurvey}>Start Survey</button>
      {started && <p>The survey has started. Good luck!</p>}
    </div>
  );
};

export default StartSurvey;