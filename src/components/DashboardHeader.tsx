import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from '../auth/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  User,
  Bell,
  Menu,
  X,
  Wallet,
} from "lucide-react"
import NotificationDropdown from './NotificationDropdown'



interface DashboardHeaderProps {
  title: string
  icon?: React.ComponentType<{ className?: string }>
  showNewServiceButton?: boolean
  isMobileMenuOpen?: boolean
  onMobileMenuToggle?: () => void
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  icon: Icon,
  showNewServiceButton = true,
  isMobileMenuOpen = false,
  onMobileMenuToggle
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [balance] = useState(0); // You can replace with actual balance logic
  
  // Get display name or fallback to email or default
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';
  
  // Get profile photo URL if available
  const photoURL = user?.photoURL;

  // Mock unread notification count
  const unreadNotificationCount = 3;

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleWalletClick = () => {
    navigate('/add-money');
  };

  return (
    <header className="flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 bg-gray-900/50 backdrop-blur-xl border-b border-gray-800/50 relative z-40">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
        {/* Mobile Menu Toggle */}
        {onMobileMenuToggle && (
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-white"
            onClick={onMobileMenuToggle}
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        )}
        
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 lg:ml-0 ml-10">
          {Icon && <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-400 flex-shrink-0" />}
          <span className="text-base sm:text-lg lg:text-2xl font-bold text-white truncate">
            <span className="hidden sm:inline">{title}</span>
            <span className="sm:hidden">{title.split(' ')[0]}</span>
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
        {/* Wallet Button with Balance */}
        <Button
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-3 sm:px-5 py-1 sm:py-2 rounded-lg font-medium shadow-lg transition-all text-xs sm:text-sm flex items-center gap-2"
          onClick={handleWalletClick}
        >
          <Wallet className="h-5 w-5 sm:h-6 sm:w-6 mr-1" />
          <span className="font-bold">₹{balance}</span>
          <span className="hidden sm:inline">Wallet</span>
        </Button>
        
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xs sm:text-sm text-slate-300 hidden md:inline">
            Hey, {displayName}
          </span>
          
          {/* Notification Bell */}
          {/* <div className="relative z-50">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative text-slate-400 hover:text-white p-1"
            >
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              {unreadNotificationCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs flex items-center justify-center bg-red-500 text-white border-0"
                >
                  {unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}
                </Badge>
              )}
            </Button>
            
            <NotificationDropdown 
              isOpen={isNotificationOpen}
              onClose={() => setIsNotificationOpen(false)}
            />
          </div> */}

          {/* User Profile Avatar */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleProfileClick}
            className="relative p-0 hover:bg-transparent"
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-indigo-400 hover:ring-offset-2 hover:ring-offset-gray-900 transition-all">
              {photoURL ? (
                <img 
                  src={photoURL} 
                  alt={displayName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to icon if image fails to load
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <User className={`h-3 w-3 sm:h-4 sm:w-4 text-white ${photoURL ? 'hidden' : ''}`} />
            </div>
          </Button>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader
