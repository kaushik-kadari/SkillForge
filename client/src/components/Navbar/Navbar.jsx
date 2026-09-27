import React, { useState, useEffect, useRef } from "react";
import { CgProfile } from "react-icons/cg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../services/AuthService";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const name = user?.name;
  const email = user?.email;
  const pathname = location.pathname.split("/");

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((open) => !open);
  };

  const navigateTo = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const desktopLinkClass = (active) =>
    `${active ? "bg-[#4f4f4f] text-white" : "text-black"} text-sm font-semibold block py-2 px-3 rounded-full transition-colors duration-200 hover:bg-[#4f4f4f] hover:text-white lg:px-2.5 xl:px-3 lg:py-1.5 whitespace-nowrap`;

  const drawerLinkClass = (active) =>
    `group relative w-full text-left rounded-xl transition-colors ${
      active ? "bg-[#ebe7de] font-semibold text-black" : "font-medium text-gray-700 hover:bg-black/[0.04]"
    }`;

  const isDashboardActive =
    pathname[1] === "dashboard" ||
    pathname[1] === "languages" ||
    pathname[1] === "topics" ||
    pathname[1] === "content" ||
    pathname[1] === "frontend" ||
    pathname[1] === "backend";

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMobileMenuOpen]);

  const navItems = [
    { to: "/", label: "Home", active: location.pathname === "/" },
    { to: "/dashboard", label: "Dashboard", active: isDashboardActive },
    { to: "/codePlay", label: "CodePlay", active: pathname[1] === "codePlay" },
    {
      to: "/interviewBot",
      label: "Interview Bot",
      active: pathname[1] === "interviewBot",
    },
  ];

  return (
    <nav className="bg-[#e1dfde] border-gray-200 sticky top-0 z-50 shadow-md h-[max(80px,10vh)] transition-all duration-300">
      <div className="max-w-screen-xl mx-auto h-full px-3 sm:px-4 lg:px-6 flex items-center justify-between gap-2 min-w-0">
        <Link to="/" className="flex items-center shrink-0 min-w-0">
          <img
            src="/Logo.png"
            alt="SkillForge"
            className="h-10 sm:h-11 lg:h-12 w-auto max-w-[160px] sm:max-w-[180px] lg:max-w-none object-contain"
          />
        </Link>

        <div className="hidden lg:flex flex-1 items-center justify-center min-w-0 px-2">
          <ul className="flex items-center justify-center font-medium gap-1 xl:gap-3 2xl:gap-6">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={desktopLinkClass(item.active)}
                  aria-current={item.active ? "page" : undefined}
                  onClick={() => navigateTo(item.to)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0 relative">
          <button
            type="button"
            className="flex text-sm text-black rounded-full p-1"
            id="user-menu-button"
            aria-expanded={isDropdownOpen}
            onClick={toggleDropdown}
          >
            <span className="sr-only">Open user menu</span>
            <CgProfile size={28} />
          </button>

          <div
            className={`absolute transition-all mt-2 w-60 right-0 divide-y bg-[#e6e6e6] divide-gray-100 rounded-lg shadow z-[60] ${
              isDropdownOpen ? "block" : "hidden"
            }`}
            ref={dropdownRef}
            id="user-dropdown"
            style={{ top: "100%" }}
            onClick={() => setIsDropdownOpen(false)}
          >
            <div className="px-4 py-3">
              <span className="block text-sm text-gray-900">{name}</span>
              <span className="block text-sm text-gray-500 truncate">{email}</span>
            </div>
            <ul className="py-2" aria-labelledby="user-menu-button">
              <li>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100"
                  onClick={() => navigateTo("/settings")}
                >
                  Settings
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="block px-4 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100"
                  onClick={() => logout()}
                >
                  Logout
                </Link>
              </li>
            </ul>
          </div>

          <button
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg lg:hidden focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="navbar-drawer"
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
      </div>

      {/* Backdrop — mirrors InterviewBot sidebar overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[55] transition-opacity duration-300 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMobileMenu}
        aria-hidden={!isMobileMenuOpen}
      />

      {/* Right drawer — full height, same pattern as InterviewBot left history */}
      <aside
        id="navbar-drawer"
        className={`lg:hidden fixed top-0 right-0 z-[60] h-[100dvh] w-72 max-w-[85vw] shrink-0 bg-white/90 backdrop-blur-md border-l border-black/[0.06] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.18)] flex flex-col transition-transform duration-300 ease-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="flex justify-between items-center px-5 pt-5 pb-4 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src="/Logo.png"
              alt=""
              className="h-9 w-auto object-contain"
            />
          </div>
          <button
            type="button"
            onClick={toggleMobileMenu}
            className="p-1.5 rounded-lg hover:bg-black/5 text-gray-600"
            aria-label="Close menu"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <p className="px-5 pt-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400 shrink-0">
          Menu
        </p>

        <nav className="overflow-y-auto flex-1 min-h-0 px-3 pb-4 space-y-0.5">
          {navItems.map((item) => (
            <div key={item.to} className={drawerLinkClass(item.active)}>
              {item.active && (
                <span className="absolute right-0 top-2 bottom-2 w-[3px] rounded-full bg-black" />
              )}
              <Link
                to={item.to}
                className="block pl-4 pr-4 py-2.5 text-sm truncate"
                onClick={() => navigateTo(item.to)}
              >
                {item.label}
              </Link>
            </div>
          ))}
        </nav>

        <div className="shrink-0 border-t border-black/[0.06] px-5 py-4">
          <p className="text-sm font-semibold text-black truncate">{name}</p>
          <p className="text-xs text-gray-500 truncate mt-0.5">{email}</p>
        </div>
      </aside>
    </nav>
  );
};

export default Navbar;
