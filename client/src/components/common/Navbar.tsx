import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Dropdown, DropdownItem, DropdownDivider } from "./Dropdown";

interface NavbarProps {
  onMenuClick: () => void;
  isSidebarOpen?: boolean;
  toggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onMenuClick,
  isSidebarOpen,
  toggleSidebar
}) => {
  const { authState, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
  };

  // Get page title based on current path
  const getPageTitle = () => {
    return "Text Analytics";
  };

  return (
    <nav className="bg-notion-default border-b border-notion-border">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - menu and breadcrumbs */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-notion-text-gray hover:text-[#37352f] hover:bg-notion-hover md:hidden"
              onClick={onMenuClick}
            >
              <span className="sr-only">Open menu</span>
              <svg
                className="h-6 w-6"
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

            {/* Page title / breadcrumb */}
            <div className="ml-2 md:ml-0">
              <h1 className="text-lg md:text-xl font-medium text-[#37352f]">
                {getPageTitle()}
              </h1>
            </div>
          </div>

          {/* Right side - actions */}
          <div className="flex items-center">
            {/* User Menu */}
            {authState.user ? (
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center text-sm rounded-full focus:outline-none hover:opacity-80 transition-opacity"
                  onClick={toggleUserMenu}
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-[#37352f] text-white flex items-center justify-center">
                    {authState.user?.name?.charAt(0) || "U"}
                  </div>
                </button>

                {/* Custom Dropdown Menu */}
                <Dropdown
                  isOpen={userMenuOpen}
                  onClose={() => setUserMenuOpen(false)}
                  align="right"
                  width="w-56"
                >
                  <div className="px-4 py-2">
                    <p className="text-sm font-medium text-[#37352f] truncate">
                      {authState.user?.name}
                    </p>
                    <p className="text-xs text-notion-text-gray truncate">
                      {authState.user?.email}
                    </p>
                  </div>
                  
                  <DropdownDivider />
                  
                  <DropdownItem as="a" href="/profile">
                    Your Profile
                  </DropdownItem>
                  
                  <DropdownItem onClick={handleLogout}>
                    Sign out
                  </DropdownItem>
                </Dropdown>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center px-3 py-1.5 border border-[#37352f] rounded-md text-sm font-medium text-white bg-[#37352f] hover:bg-[#2f2c26] focus:outline-none transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
