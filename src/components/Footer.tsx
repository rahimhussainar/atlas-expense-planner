import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-12 px-4 md:px-6 lg:px-8 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1b1f]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} Trip Atlas. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
