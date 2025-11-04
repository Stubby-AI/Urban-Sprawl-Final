
import React from 'react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-white dark:bg-slate-800/50 backdrop-blur-sm shadow-md sticky top-0 z-10 border-b border-gray-200 dark:border-slate-700">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
          {title}
        </h1>
      </div>
    </header>
  );
};

export default Header;
