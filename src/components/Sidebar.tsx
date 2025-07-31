import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: CreditCard, label: "Passport Photo", path: "/passport-photo" },
    { icon: Edit3, label: "Editor", path: "/editor" },
    { icon: FileText, label: "Cards", path: "/cards" },
    { icon: FileStack, label: "Free Cards", path: "/free-cards" },
    { icon: DollarSign, label: "Kundli", path: "/kundli" },
    { icon: DollarSign, label: "Id Card", path: "/id-card" },
    { icon: FileText, label: "Page Maker", path: "/page-maker" },
    { icon: FileText, label: "Resume Maker", path: "/resume" },
    { icon: DollarSign, label: "Add Money", path: "/add-money" },
  ];

  const otherItems = [
    { icon: MessageSquare, label: "Contact", path: "/contact" },
    { icon: HelpCircle, label: "FAQ", path: "/faq" },
  ];

  const isActiveRoute = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Menu Toggle */}
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden fixed top-4 left-4 z-50 text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-full w-64 bg-gray-900/50 backdrop-blur-xl border-r border-gray-800/50 z-40 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static
      `}>
        {/* Logo */}
        <div className="px-6 py-6 border-b border-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl text-white">ID Maker</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-3 py-4">
          <div className="space-y-2">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`
                  w-full text-left p-2 rounded-xl transition-all duration-200 flex items-center gap-3
                  ${isActiveRoute(item.path) 
                    ? 'bg-indigo-500/10 text-indigo-400' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }
                `}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
            
            <div className="text-xs text-gray-500 uppercase tracking-wider px-3 py-2 mt-4">Other</div>
            
            {otherItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="w-full text-left p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all duration-200 flex items-center gap-3"
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
            
            <button className="w-full text-left p-2 mt-8 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 flex items-center gap-3">
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
