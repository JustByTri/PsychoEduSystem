import React from 'react';

const NotesCard = () => {
  return (
    <div className="bg-white rounded-xl p-3 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Notes</h2>
      <p className="text-gray-600 mb-4">Be the best version of yourself</p>
      <button className="w-full py-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors">
        Edit
      </button>
    </div>
  );
};

export default NotesCard; 