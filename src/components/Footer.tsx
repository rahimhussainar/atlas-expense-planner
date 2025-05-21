import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 px-6 md:px-8 lg:px-12 bg-background">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-muted-foreground">
          © {new Date().getFullYear()} Trip Atlas
        </p>
      </div>
    </footer>
  );
};

export default Footer;
