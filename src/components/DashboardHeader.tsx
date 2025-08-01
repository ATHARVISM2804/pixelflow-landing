import React from 'react'
import { Button } from "@/components/ui/button"
import { useAuth } from '../auth/AuthContext.tsx';
import {
  Plus,
  User,
  Bell,
  Menu,
  X,
} from "lucide-react"


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
  
  // Get display name or fallback to email or default
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';
  
  // Get profile photo URL if available
  const photoURL = user?.photoURL;

  return (
    <header className="flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 bg-gray-900/50 backdrop-blur-xl border-b border-gray-800/50">
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
        {showNewServiceButton && (
          <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg font-medium shadow-lg transition-all text-xs sm:text-sm">
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">New Service Request</span>
            <span className="sm:hidden">New</span>
          </Button>
        )}
        
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xs sm:text-sm text-slate-300 hidden md:inline">
            Hey, {displayName}
          </span>
          <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
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
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader
