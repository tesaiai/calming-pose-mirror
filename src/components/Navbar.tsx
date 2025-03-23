
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link 
            to="/" 
            className="text-foreground font-medium text-xl tracking-tight hover:opacity-80 transition-opacity"
          >
            Yoga Pose Classifier
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {[
              { name: 'Home', path: '/' },
              { name: 'Practice', path: '/practice' },
              { name: 'Settings', path: '/settings' },
            ].map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`transition-all duration-300 px-2 py-1 rounded-md ${
                  location.pathname === item.path
                    ? 'text-sage-700 font-medium'
                    : 'text-foreground/80 hover:text-sage-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* Mobile menu button */}
          <button
            className="md:hidden rounded-md p-2 text-foreground focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden glass mt-1 animate-fade-in">
          <div className="px-4 pt-2 pb-5 space-y-1">
            {[
              { name: 'Home', path: '/' },
              { name: 'Practice', path: '/practice' },
              { name: 'Settings', path: '/settings' },
            ].map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-3 py-3 rounded-md transition-colors ${
                  location.pathname === item.path
                    ? 'text-sage-700 bg-sage-50 font-medium'
                    : 'text-foreground hover:bg-sage-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
