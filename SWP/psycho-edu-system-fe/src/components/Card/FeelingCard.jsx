import React from 'react';
import { Pencil } from 'lucide-react';

const FeelingCard = () => {
  const feelings = [
    { id: 1, emoji: "😊", name: "Happy" },
    { id: 2, emoji: "😎", name: "Cool" },
    { id: 3, emoji: "🤔", name: "Thinking" },
    { id: 4, emoji: "😄", name: "Excited" },
  ];

  return (
    <div className="bg-white rounded-xl p-3 shadow-sm">
      <h2 className="text-xl font-semibold font-medium mb-4">How are you feeling today?</h2>
      <div className="flex gap-4 mb-4">
        {feelings.map((feeling) => (
          <button
            key={feeling.id}
            className="flex flex-col items-center"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl">
              {feeling.emoji}
            </div>
          </button>
        ))}
        <button className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
          <Pencil className="w-6 h-6 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default FeelingCard;
