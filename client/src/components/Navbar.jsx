import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldAlert, BookOpen, Map as MapIcon, LogOut, Menu, X, Shield, Activity, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: <Activity className="w-4 h-4 mr-2" />, show: !!user },
    { name: 'Learn', path: '/learn', icon: <BookOpen className="w-4 h-4 mr-2" />, show: !!user },
    { name: 'Report Incident', path: '/report', icon: <ShieldAlert className="w-4 h-4 mr-2" />, show: !!user },
    { name: 'Safe Zones', path: '/map', icon: <MapIcon className="w-4 h-4 mr-2" />, show: !!user },
    { name: 'Admin Hub', path: '/admin', icon: <Shield className="w-4 h-4 mr-2" />, show: user?.role === 'admin' },
  ];

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'glass shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white shadow-lg">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">
                Disaster<span className="text-red-500">Edu</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.filter(link => link.show).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'bg-red-50 text-red-600'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            {user ? (
              <div className="flex items-center pl-4 border-l border-slate-200 ml-4">
                <div className="flex items-center text-sm font-medium text-slate-700 mr-4">
                  <User className="w-4 h-4 mr-2" />
                  {user.name}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-sm font-medium text-red-600 hover:text-red-700 px-3 py-2 rounded-md hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-sm transition-colors">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass absolute w-full border-b border-slate-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.filter(link => link.show).map((link) => (
               <Link
               key={link.path}
               to={link.path}
               onClick={() => setIsOpen(false)}
               className={`flex items-center block px-3 py-2 rounded-md text-base font-medium ${
                 location.pathname === link.path
                   ? 'bg-red-50 text-red-600'
                   : 'text-slate-600 hover:bg-slate-100'
               }`}
             >
               {link.icon}
               {link.name}
             </Link>
            ))}
            {user ? (
              <button
                onClick={() => { handleLogout(); setIsOpen(false); }}
                className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
            ) : (
              <div className="flex flex-col space-y-2 px-3 py-2">
                <Link to="/login" className="text-center w-full px-4 py-2 bg-slate-100 text-slate-900 rounded-lg">Login</Link>
                <Link to="/register" className="text-center w-full px-4 py-2 bg-red-600 text-white rounded-lg">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
