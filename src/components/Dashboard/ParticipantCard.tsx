import React from 'react';

const ParticipantCard = ({ participant }: any) => (
  <div className="relative group">
    <div className="bg-white dark:bg-[#272829] rounded-xl p-4 border border-gray-200 dark:border-white/10 hover:border-[#4a6c6f]/30 dark:hover:border-[#4a6c6f]/30 transition-all shadow-sm hover:shadow-md">
      <div className="flex items-start space-x-3">
        {/* Avatar placeholder */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4a6c6f] to-[#6a9c7f] flex items-center justify-center text-white font-medium">
          {participant.name.split(' ').map((n: string) => n[0]).join('')}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-medium truncate text-gray-900 dark:text-white">{participant.name}</h3>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              participant.status === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
              participant.status === 'maybe' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
              'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
            }`}>
              {participant.status}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{participant.email}</p>
          <div className="mt-2 flex items-center space-x-2">
            {participant.owes > 0 && (
              <div className="flex items-center text-sm">
                <span className="text-red-600 dark:text-red-400 font-medium">-${participant.owes}</span>
              </div>
            )}
            {participant.owed > 0 && (
              <div className="flex items-center text-sm">
                <span className="text-green-600 dark:text-green-400 font-medium">+${participant.owed}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ParticipantCard; 