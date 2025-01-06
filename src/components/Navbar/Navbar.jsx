import React, { useState, useEffect, useRef } from 'react';
import { CgProfile } from 'react-icons/cg';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Content from '../Content/Content';
import GenerateContent from '../GenerateContent/GenerateContent';
import Progress from '../Progress/Progress';
import Topic from '../Topic/Topic';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const name = localStorage.getItem('name');
  const email = localStorage.getItem('email');

  const pathname = location.pathname.split('/');
  // console.log(pathname[1]);

  const login = localStorage.getItem('login');
  // console.log(login);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navigateTo = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('login');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    window.location.href = '/';
  };

  return (
    <nav className="bg-[#e1dfde] border-gray-200 sticky top-0 z-50 shadow-md h-[max(80px,10vh)] transition-all duration-300">
      <div className="max-w-screen-xl mx-auto p-4 flex flex-wrap items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src="Logo.png" alt="" className="h-12" />
        </Link>
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse relative">
          <button
            type="button"
            className="flex text-sm text-black rounded-full md:me-0"
            id="user-menu-button"
            aria-expanded={isDropdownOpen}
            onClick={toggleDropdown}
          >
            <span className="sr-only">Open user menu</span>
            <CgProfile size={28} />
          </button>
          {/* Dropdown menu */}
          <div
            className={`absolute transition-all mt-2 w-60 right-0 divide-y bg-[#e6e6e6] divide-gray-100 rounded-lg shadow ${isDropdownOpen ? 'block' : 'hidden'}`}
            ref={dropdownRef}
            id="user-dropdown"
            style={{ top: '100%' }} // Ensure the dropdown is below the button
            onClick={() => setIsDropdownOpen(false)}
          >
            <div className="px-4 py-3">
              <span className="block text-sm text-gray-900">{name}</span>
              <span className="block text-sm text-gray-500 truncate ">{email}</span>
            </div>
            <ul className="py-2 " aria-labelledby="user-menu-button">
              <li>
                <Link
                  to="/settings"
                  className={`${pathname[2] in ['dashboard', 'languages', 'topics', 'content'] ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700 rounded-lg`}
                  onClick={() => navigateTo('/settings')}
                >
                  Settings
                </Link>
              </li>
              <li>
                <Link
                  to="/signout"
                  className={`${location.pathname === '/signout' ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700 rounded-lg`}
                  onClick={() => handleSignOut()}
                >
                  Sign out
                </Link>
              </li>
            </ul>
          </div>
          <button
            data-collapse-toggle="navbar-user"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden  focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="navbar-user"
            aria-expanded={isMobileMenuOpen}
            onClick={toggleMobileMenu}
          >
            <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
          </button>
        </div>
        <div
          className={`items-center  justify-between md:flex md:w-auto md:order-1 ${isMobileMenuOpen ? 'fixed top-0 right-0 bottom-0 left-0 z-50' : 'hidden'}`}
          id="navbar-user"
          style={{ backdropFilter: isMobileMenuOpen ? 'blur(8px)' : 'none' }}
        >
          <ul className="md:flex justify-center font-medium mt-4 lg:mt-0  p-4 rounded-lg  md:space-x-8 rtl:space-x-reverse md:border-0">
            <li>
              <button
                type="button"
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} items-center text-sm font-semibold block py-2 px-3 text-black rounded-full transition-colors duration-200 hover:bg-[#4f4f4f] hover:text-white md:p-2`}
                onClick={toggleMobileMenu}
              >
                <svg
                  className="w-7 h-7 mb-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </li>
            <li>
              <Link
                to="/"
                className={`${location.pathname === '/' ? 'bg-[#4f4f4f] text-white' : ''} text-sm font-semibold block py-2 px-3 text-black rounded-full transition-colors duration-200 hover:bg-[#4f4f4f] hover:text-white md:p-2`}
                aria-current="page"
                onClick={() => navigateTo('/')}
              >
                Home
              </Link>
            </li>
            {login === 'true' && (
            <li>
              <Link
                to="/dashboard"
                className={`${pathname[1] === 'dashboard' || pathname[1] === 'languages' || pathname[1] === 'topics' || pathname[1] === 'content' || pathname[1] === 'frontend' || pathname[1] === 'backend' ? 'bg-[#4f4f4f] text-white' : ''} text-sm font-semibold block py-2 px-3 text-black rounded-full transition-colors duration-200 hover:bg-[#4f4f4f] hover:text-white md:p-2`}
                onClick={() => navigateTo('/dashboard')}
              >
                Dashboard
              </Link>
            </li>
            )}
            <li>
              <Link
                to="/about"
                className={`${pathname[1] === 'about' ? 'bg-[#4f4f4f] text-white' : ''} text-sm font-semibold block py-2 px-3 text-black rounded-full transition-colors duration-200 hover:bg-[#4f4f4f] hover:text-white md:p-2`}
                onClick={() => navigateTo('/about')}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/help"
                className={`${location.pathname === '/help' ? 'bg-[#4f4f4f] text-white' : ''} text-sm font-semibold block py-2 px-3 text-black rounded-full transition-colors duration-200 hover:bg-[#4f4f4f] hover:text-white md:p-2`}
                onClick={() => navigateTo('/help')}
              >
                Help              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className={`${location.pathname === '/contact' ? 'bg-[#4f4f4f] text-white' : ''} text-sm font-semibold block py-2 px-3 text-black rounded-full transition-colors duration-200 hover:bg-[#4f4f4f] hover:text-white md:p-2`}
                onClick={() => navigateTo('/contact')}
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
