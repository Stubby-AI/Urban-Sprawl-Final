import React from 'react';

// This is a simplified version of Page type for props
type Page = 'intro' | 'analysis';

// --- Helper Icons (copied from App.tsx for encapsulation) ---
const HomeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const ChartIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
  </svg>
);

const UrboIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Head */}
    <rect x="7" y="4" width="10" height="8" rx="1.5" />
    {/* Antenna */}
    <line x1="12" y1="4" x2="12" y2="2" />
    <circle cx="12" cy="1.5" r="0.5" fill="currentColor" />
    {/* Eyes */}
    <circle cx="10" cy="8" r="0.5" fill="currentColor" />
    <circle cx="14" cy="8" r="0.5" fill="currentColor" />
    {/* Mouth */}
    <path d="M10 10 C 11 11, 13 11, 14 10" />
    {/* Body */}
    <rect x="6" y="13" width="12" height="7" rx="1.5" />
    {/* Button on body */}
    <circle cx="12" cy="16.5" r="1.5" />
    {/* Waving arm */}
    <path d="M6 15 C 3.5 15 3 12 5 11" />
    {/* Other arm */}
    <path d="M18 15 V 17" />
    {/* Feet */}
    <path d="M8 20v1.5a1 1 0 0 0 2 0V20" />
    <path d="M14 20v1.5a1 1 0 0 0 2 0V20" />
  </svg>
);

interface MobileBottomNavProps {
  activePage: Page;
  setPage: (page: Page) => void;
  onOpenChat: () => void;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activePage, setPage, onOpenChat }) => {
  const navItems = [
    { id: 'intro', label: 'Intro', icon: <HomeIcon className="h-6 w-6 mb-1" /> },
    { id: 'analysis', label: 'Analysis', icon: <ChartIcon className="h-6 w-6 mb-1" /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-20">
      <div className="flex justify-around items-center h-16">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setPage(item.id as Page)}
            className={`flex flex-col items-center justify-center w-full transition-colors duration-200 p-1 ${
              activePage === item.id 
              ? 'text-teal-500 dark:text-teal-400' 
              : 'text-gray-500 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400'
            }`}
          >
            {item.icon}
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
        <button
          onClick={onOpenChat}
          className="flex flex-col items-center justify-center w-full text-gray-500 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400 p-1"
        >
          <UrboIcon className="h-6 w-6 mb-1" />
          <span className="text-xs font-medium">Ask Urbo</span>
        </button>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
