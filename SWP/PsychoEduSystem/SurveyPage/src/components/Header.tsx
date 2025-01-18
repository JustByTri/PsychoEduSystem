import React from 'react';
import { Menu, X, User, LogOut, ClipboardList } from 'lucide-react';

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

export function Header({ isMenuOpen, setIsMenuOpen, isLoggedIn, setIsLoggedIn }: HeaderProps) {
  return (
    <header className="glass-effect sticky top-0 z-50 border-b border-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <ClipboardList className="h-8 w-8 text-purple-600" />
            <h1 className="text-2xl font-bold gradient-text">
              Survey Portal
            </h1>
          </div>

          <nav className="hidden md:flex space-x-1">
            <a href="#" className="text-gray-700 hover:text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-full transition-all duration-200">About</a>
            <a href="#" className="text-gray-700 hover:text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-full transition-all duration-200">News</a>
            <a href="#" className="text-purple-600 bg-purple-50 px-4 py-2 rounded-full font-medium">Survey</a>
            <a href="#" className="text-gray-700 hover:text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-full transition-all duration-200">Contact</a>
          </nav>

          <div className="hidden md:flex items-center">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-50 to-indigo-50">
                  <User className="h-5 w-5 text-purple-600" />
                  <span className="text-purple-600 font-medium">John Doe</span>
                </div>
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-full transition-all duration-200"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="space-x-3">
                <button
                  onClick={() => setIsLoggedIn(true)}
                  className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-full transition-all duration-200"
                >
                  Login
                </button>
                <button 
                  className="button-gradient px-4 py-2 text-white rounded-full shadow-lg shadow-indigo-200 transition-all duration-200"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-purple-600 transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-purple-100">
          <div className="px-4 py-3 space-y-2">
            <a href="#" className="block px-4 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all duration-200">About</a>
            <a href="#" className="block px-4 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all duration-200">News</a>
            <a href="#" className="block px-4 py-2 text-purple-600 bg-purple-50 rounded-full font-medium">Survey</a>
            <a href="#" className="block px-4 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all duration-200">Contact</a>
            {isLoggedIn ? (
              <button
                onClick={() => setIsLoggedIn(false)}
                className="w-full text-left px-4 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all duration-200"
              >
                Logout
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => setIsLoggedIn(true)}
                  className="w-full text-left px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-full transition-all duration-200"
                >
                  Login
                </button>
                <button className="w-full text-left button-gradient px-4 py-2 text-white rounded-full shadow-lg shadow-indigo-200 transition-all duration-200">
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}