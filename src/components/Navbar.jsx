import React, { useState, useEffect, useRef } from 'react';
import { CgProfile } from 'react-icons/cg';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={`bg-[#e1dfde] border-gray-200 sticky top-0 shadow-md h-[10vh] transition-opacity duration-300 ${isSticky ? 'opacity-100' : 'opacity-100'}`}>
    <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <a to="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
        <img src="Logo.png" className="w-40" alt="Flowbite Logo" />
      </a>
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
          className={`absolute right-0 mt-2 w-48 divide-y bg-gray-50 divide-gray-100 rounded-lg shadow ${isDropdownOpen ? 'block' : 'hidden'}`}
          ref={dropdownRef}
          id="user-dropdown"
          style={{ top: '100%' }} // Ensure the dropdown is below the button
        >
          <div className="px-4 py-3">
            <span className="block text-sm text-gray-900">Bonnie Green</span>
            <span className="block text-sm text-gray-500 truncate">name@flowbite.com</span>
          </div>
          <ul className="py-2" aria-labelledby="user-menu-button">
            <li>
              <a
                to="#"
                className="block px-4 py-2 text-sm text-gray-700 "
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                to="#"
                className="block px-4 py-2 text-sm text-gray-700 "
              >
                Settings
              </a>
            </li>
            <li>
              <a
                to="#"
                className="block px-4 py-2 text-sm text-gray-700 "
              >
                Earnings
              </a>
            </li>
            <li>
              <a
                to="#"
                className="block px-4 py-2 text-sm text-gray-700 "
              >
                Sign out
              </a>
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
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
      </div>
      <div
        className={`items-center  justify-between w-full md:flex md:w-auto md:order-1 ${isMobileMenuOpen ? 'block bg-gray-50' : 'hidden'}`}
        id="navbar-user"
      >
        <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg  md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
          <li>
            <Link
              to="/"
              className="block py-2 px-3 text-black rounded transition-colors duration-200 hover:text-blue-500 md:p-0"
              aria-current="page"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard"
              className="block py-2 px-3 text-black rounded transition-colors duration-200 hover:text-blue-500 md:p-0"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="#"
              className="block py-2 px-3 text-black rounded transition-colors duration-200 hover:text-blue-500 md:p-0"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="#"
              className="block py-2 px-3 text-black rounded transition-colors duration-200 hover:text-blue-500 md:p-0"
            >
              Help
            </Link>
          </li>
          <li>
            <Link
              to="#"
              className="block py-2 px-3 text-black rounded transition-colors duration-200 hover:text-blue-500 md:p-0"
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
