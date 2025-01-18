import React, { useState } from 'react';
import './survey.css';

const Survey = () => {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Feedback submitted:', feedback);
    setFeedback('');
    setSubmitted(true);
  };

  return (
    <div className="survey-container">
      <h2>Take Our Survey</h2>
      <p>Please take a moment to fill out our survey. Your feedback is valuable to us.</p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Enter your feedback"
        />
        <button type="submit">Submit</button>
      </form>
      {submitted && <p>Thank you for your feedback!</p>}
    </div>
  );
};

export default Survey;