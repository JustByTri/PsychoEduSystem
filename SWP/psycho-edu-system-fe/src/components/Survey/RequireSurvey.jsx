// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { SurveyService } from "../../api/services/surveyService";

const RequireSurvey = () => {
  const [loading, setLoading] = useState(true);
  const [hasCompletedSurvey, setHasCompletedSurvey] = useState(false);
  const [surveyData, setSurveyData] = useState(null);

  useEffect(() => {
    const checkSurveyStatus = async () => {
      try {
        const response = await SurveyService.checkUserSurveyStatus();
        console.log("API response:", response);

        if (response?.surveys && response.surveys.surveyId) {
          setHasCompletedSurvey(false);
          setSurveyData(response.surveys.surveyId);
          console.log(response.surveys.surveyId);
        } else {
          setHasCompletedSurvey(true);
          setSurveyData(null);
        }
      } catch (error) {
        console.error("Error checking survey status:", error);
        setHasCompletedSurvey(true);
        setSurveyData(null);
      } finally {
        setLoading(false);
      }
    };

    checkSurveyStatus();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!hasCompletedSurvey) {
    console.log("Survey Data being sent to StartUpPage:", surveyData);
    return (
      <Navigate to="/student/start-up-survey" state={{ surveyData }} replace />
    );
  }

  return <Outlet context={{ surveyData: surveyData ?? null }} />;
};

export default RequireSurvey;
