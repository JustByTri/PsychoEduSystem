import React, { useState } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react';
import { Header } from './components/Header';
import { Modal } from './components/Modal';
import { SurveyContent } from './components/SurveyContent';

export function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(null);

  const handleStartSurvey = () => {
    if (!isLoggedIn) {
      setError("You need to log in to take the survey");
      return;
    }
    // Will navigate to survey form
  };

  const handleSkipSurvey = () => {
    setShowSkipModal(true);
  };

  const handleSkipConfirm = (confirm) => {
    setShowSkipModal(false);
    if (confirm) {
      try {
        console.log("Navigating to home page...");
        // Add navigation logic here
      } catch (e) {
        setError("Failed to navigate to home page");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
      />

      <SurveyContent 
        onStartSurvey={handleStartSurvey}
        onSkipSurvey={handleSkipSurvey}
      />

      <Modal
        isOpen={showSkipModal}
        onClose={() => setShowSkipModal(false)}
      >
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Are you sure you want to skip the survey?
          </h3>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => handleSkipConfirm(false)}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              No
            </button>
            <button
              onClick={() => handleSkipConfirm(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Yes
            </button>
          </div>
        </div>
      </Modal>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <span onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>Close</title>
              <path d="M14.348 5.652a1 1 0 00-1.414 0L10 8.586 7.066 5.652a1 1 0 10-1.414 1.414L8.586 10l-2.934 2.934a1 1 0 101.414 1.414L10 11.414l2.934 2.934a1 1 0 001.414-1.414L11.414 10l2.934-2.934a1 1 0 000-1.414z"/>
            </svg>
          </span>
        </div>
      )}
    </div>
  );
}
