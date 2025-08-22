import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  CreditCard, 
  Camera, 
  FileText, 
  Star, 
  GraduationCap,
  Settings,
  LogOut,
  Menu,
  X,
  Edit3,
  FileStack,
  DollarSign,
  MessageSquare,
  HelpCircle,
  Shield,
  Scissors
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from 'firebase/auth';
import { auth } from '../auth/firebase';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: CreditCard, label: "Passport Photo", path: "/passport-photo" },
    { icon: Edit3, label: "Editor", path: "/editor" },
    { icon: FileText, label: "Free Cards", path: "/cards" },
    { icon: FileStack, label: "Cards", path: "/free-cards" },
    { icon: Shield, label: "DID", path: "/did" },
    { icon: DollarSign, label: "Kundli", path: "/kundli" },
    { icon: DollarSign, label: "Id Card", path: "/id-card" },
    { icon: FileText, label: "Page Maker", path: "/page-maker" },
    { icon: FileText, label: "Resume Maker", path: "/resume" },
    { icon: DollarSign, label: "Add Money", path: "/add-money" },
  ];

  const otherItems = [
    // { icon: MessageSquare, label: "Contact", path: "/contact" },
    { icon: HelpCircle, label: "FAQ", path: "/faq" },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Failed to log out. Please try again.');
    }
  };

  const isActiveRoute = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Menu Toggle */}
      <Button
        variant="ghost"
        size="sm"
        className="lg:hidden fixed top-3 left-3 z-50 text-white bg-gray-900/80 backdrop-blur rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </Button>

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-screen w-64 sm:w-72 lg:w-[280px] bg-gray-900/50 backdrop-blur-xl border-r border-gray-800/50 z-40 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Logo */}
        <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-800/50 flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg sm:rounded-xl shadow-lg">
              <CreditCard className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
            <span className="font-bold text-lg sm:text-xl text-white">ID Maker</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col h-[calc(100vh-100px)] px-2 sm:px-3 py-2 sm:py-4">
          <div className="flex-1 overflow-y-auto space-y-1 sm:space-y-2 scrollbar-hidden">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`
                  w-full text-left p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-200 flex items-center gap-2 sm:gap-3 text-sm sm:text-base
                  ${isActiveRoute(item.path) 
                    ? 'bg-indigo-500/10 text-indigo-400' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }
                `}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            ))}
            
            <div className="text-xs text-gray-500 uppercase tracking-wider px-2 sm:px-3 py-1 sm:py-2 mt-3 sm:mt-4">Other</div>
            
            {otherItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="w-full text-left p-2 sm:p-3 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg sm:rounded-xl transition-all duration-200 flex items-center gap-2 sm:gap-3 text-sm sm:text-base"
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            ))}
          </div>
          
          {/* Logout button at bottom */}
          <div className="flex-shrink-0 pt-4 border-t border-gray-800/30">
            <button 
              onClick={handleLogout}
              className="w-full text-left p-2 sm:p-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg sm:rounded-xl transition-all duration-200 flex items-center gap-2 sm:gap-3 text-sm sm:text-base"
            >
              <LogOut className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
