import React from 'react';

const ParticipantCard = ({ participant }: any) => (
  <div className="relative group">
    <div className="bg-white dark:bg-[#23272b] rounded-xl p-4 border border-gray-100 dark:border-[#23272b] hover:border-blue-100 transition-all">
      <div className="flex items-start space-x-3">
        {/* Avatar placeholder */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 font-medium">
          {participant.name.split(' ').map((n: string) => n[0]).join('')}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-medium truncate text-black dark:text-white">{participant.name}</h3>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              participant.status === 'confirmed' ? 'bg-green-50 text-green-700 dark:bg-green-900/40 dark:text-green-300' :
              participant.status === 'maybe' ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-200' :
              'bg-red-50 text-red-700 dark:bg-red-900/40 dark:text-red-200'
            }`}>
              {participant.status}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-300 truncate">{participant.email}</p>
          <div className="mt-2 flex items-center space-x-2">
            {participant.owes > 0 && (
              <div className="flex items-center text-sm">
                <span className="text-red-500 font-medium">-${participant.owes}</span>
              </div>
            )}
            {participant.owed > 0 && (
              <div className="flex items-center text-sm">
                <span className="text-green-500 font-medium">+${participant.owed}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ParticipantCard; 