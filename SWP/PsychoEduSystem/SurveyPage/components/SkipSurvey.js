import React from 'react';
import './SkipSurvey.css';

const SkipSurvey = () => {
  const skipSurvey = () => {
    // Add logic to skip the survey
    console.log("Survey skipped!");
  };

  return (
    <div className="skip-survey-container">
      <h2 className="skip-survey-title">Skip Survey</h2>
      <button className="skip-survey-button" onClick={skipSurvey}>Skip Survey</button>
    </div>
  );
};

export default SkipSurvey;