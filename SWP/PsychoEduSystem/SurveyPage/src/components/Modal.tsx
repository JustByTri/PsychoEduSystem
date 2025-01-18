import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        ></div>

        <div className="relative glass-effect rounded-2xl shadow-xl max-w-lg w-full border border-indigo-100">
          <div className="p-6">
            <div className="flex items-center space-x-3 text-gray-900 mb-6">
              <AlertCircle className="h-6 w-6 text-purple-600" />
              <h3 className="text-xl font-semibold gradient-text">
                Are you sure you want to skip the survey?
              </h3>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => onClose()}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200"
              >
                No, continue
              </button>
              <button
                onClick={() => {
                  onClose();
                  // Handle skip confirmation
                }}
                className="button-gradient px-6 py-2 text-white rounded-full shadow-lg shadow-indigo-200 transition-all duration-200"
              >
                Yes, skip
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}