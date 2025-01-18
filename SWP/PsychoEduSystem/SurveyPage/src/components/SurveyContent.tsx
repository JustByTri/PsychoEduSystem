import React from 'react';
import { ClipboardCheck, ArrowRight } from 'lucide-react';

interface SurveyContentProps {
  onStartSurvey: () => void;
  onSkipSurvey: () => void;
}

export function SurveyContent({ onStartSurvey, onSkipSurvey }: SurveyContentProps) {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="glass-effect rounded-2xl shadow-xl p-8 sm:p-12 border border-indigo-100">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 mb-6">
              <ClipboardCheck className="h-8 w-8 text-purple-600" />
            </div>
            <h2 className="text-4xl font-bold gradient-text mb-4">
              Welcome to Our Survey
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Your feedback helps us improve our services and better understand your needs.
              Please take a moment to complete our survey.
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button
                onClick={onStartSurvey}
                className="group flex items-center space-x-2 button-gradient px-8 py-4 rounded-full text-white shadow-lg shadow-indigo-200 transition-all duration-200"
              >
                <span className="font-medium">Start Survey</span>
                <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={onSkipSurvey}
                className="text-gray-500 hover:text-purple-600 underline-offset-4 hover:underline transition-colors"
              >
                Skip Survey
              </button>
            </div>

            <div className="flex justify-center">
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-50 to-emerald-50">
                  <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 mr-2"></span>
                  <span className="text-green-600">5 minutes to complete</span>
                </div>
                <div className="flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50">
                  <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 mr-2"></span>
                  <span className="text-blue-600">10 questions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}