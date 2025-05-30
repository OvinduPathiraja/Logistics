import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { PackageOpen, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const auth = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileMenuOpen]);

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled || mobileMenuOpen
          ? 'bg-white shadow-md py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <PackageOpen 
              className={`h-8 w-8 ${isScrolled || mobileMenuOpen ? 'text-blue-600' : 'text-white'}`} 
            />
            <span 
              className={`ml-2 text-xl font-bold ${isScrolled || mobileMenuOpen ? 'text-gray-800' : 'text-white'}`}
            >
              XYZ Logistics
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink href="/#services" isScrolled={isScrolled}>
              Services
            </NavLink>
            <NavLink href="/#about" isScrolled={isScrolled}>
              About Us
            </NavLink>
            <NavLink href="/#contact" isScrolled={isScrolled}>
              Contact
            </NavLink>
            
            {auth.isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition duration-300"
              >
                Dashboard
              </Link>
            ) : (
              <button
                onClick={() => auth.signinRedirect()}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition duration-300"
              >
                Sign In
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-800" />
            ) : (
              <Menu className={`h-6 w-6 ${isScrolled ? 'text-gray-800' : 'text-white'}`} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white pt-16">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <MobileNavLink href="/#services" onClick={() => setMobileMenuOpen(false)}>
                Services
              </MobileNavLink>
              <MobileNavLink href="/#about" onClick={() => setMobileMenuOpen(false)}>
                About Us
              </MobileNavLink>
              <MobileNavLink href="/#contact" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </MobileNavLink>
              
              {auth.isAuthenticated ? (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full px-4 py-3 rounded-md bg-blue-600 text-white text-center font-medium hover:bg-blue-700 transition duration-300"
                >
                  Dashboard
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    auth.signinRedirect();
                  }}
                  className="w-full px-4 py-3 rounded-md bg-blue-600 text-white text-center font-medium hover:bg-blue-700 transition duration-300"
                >
                  Sign In
                </button>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

interface NavLinkProps {
  href: string;
  isScrolled: boolean;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, isScrolled, children }) => (
  <a
    href={href}
    className={`font-medium transition duration-300 ${
      isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-300'
    }`}
  >
    {children}
  </a>
);

interface MobileNavLinkProps {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ href, onClick, children }) => (
  <a
    href={href}
    onClick={onClick}
    className="text-gray-800 font-medium text-lg py-2 hover:text-blue-600 transition duration-300"
  >
    {children}
  </a>
);

export default Header;