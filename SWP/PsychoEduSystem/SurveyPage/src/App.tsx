import React, { useState } from 'react';
// import { Menu, X, User, LogOut } from 'lucide-react';
import { Header } from './components/Header';
import { Modal } from './components/Modal';
import { SurveyContent } from './components/SurveyContent';

export function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleStartSurvey = () => {
    if (!isLoggedIn) {
      alert("You need to log in to take the survey");
      return;
    }
    // Will navigate to survey form
  };

  const handleSkipSurvey = () => {
    setShowSkipModal(true);
  };

  const handleSkipConfirm = (confirm: boolean) => {
    setShowSkipModal(false);
    if (confirm) {
      console.log("Navigating to home page...");
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
    </div>
  );
}