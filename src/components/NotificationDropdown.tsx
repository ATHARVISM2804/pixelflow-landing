import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Bell, 
  X, 
  Check, 
  Info, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Trash2,
  MarkAsUnread
} from "lucide-react"

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  time: string
  read: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

interface NotificationDropdownProps {
  isOpen: boolean
  onClose: () => void
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Card Generation Complete',
    message: 'Your Aadhaar card has been successfully generated and is ready for download.',
    type: 'success',
    time: '2 minutes ago',
    read: false,
    action: {
      label: 'Download',
      onClick: () => console.log('Download card')
    }
  },
  {
    id: '2',
    title: 'Payment Successful',
    message: 'Your payment of ₹50 for Resume Maker service has been processed successfully.',
    type: 'success',
    time: '1 hour ago',
    read: false
  },
  {
    id: '3',
    title: 'Service Update',
    message: 'New features added to PDF Processor - merge, split, and compress PDFs with enhanced quality.',
    type: 'info',
    time: '3 hours ago',
    read: true
  },
  {
    id: '4',
    title: 'Upload Failed',
    message: 'Failed to upload your document. Please check file format and try again.',
    type: 'error',
    time: '1 day ago',
    read: true,
    action: {
      label: 'Retry',
      onClick: () => console.log('Retry upload')
    }
  },
  {
    id: '5',
    title: 'Account Verification',
    message: 'Please verify your email address to access all premium features.',
    type: 'warning',
    time: '2 days ago',
    read: false,
    action: {
      label: 'Verify',
      onClick: () => console.log('Verify email')
    }
  }
]

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />
      case 'error':
        return <X className="h-4 w-4 text-red-400" />
      default:
        return <Info className="h-4 w-4 text-blue-400" />
    }
  }

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500'
      case 'warning':
        return 'border-l-yellow-500'
      case 'error':
        return 'border-l-red-500'
      default:
        return 'border-l-blue-500'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] lg:relative lg:inset-auto">
      {/* Mobile backdrop */}
      <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-[9998]" onClick={onClose} />
      
      {/* Dropdown */}
      <div 
        ref={dropdownRef}
        className="fixed top-16 right-4 w-[calc(100vw-2rem)] max-w-md lg:absolute lg:top-full lg:right-0 lg:w-96 bg-gray-900/95 backdrop-blur-xl border-2 border-gray-700/70 rounded-lg shadow-2xl max-h-[80vh] flex flex-col z-[10000]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-gray-700/50">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-indigo-400" />
            <h3 className="text-white font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="bg-indigo-500 text-white text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-gray-400 hover:text-white text-xs"
              >
                <Check className="h-3 w-3 mr-1" />
                Mark all read
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 mx-auto mb-4 text-gray-500 opacity-50" />
              <p className="text-gray-400 text-sm">No notifications</p>
            </div>
          ) : (
            <div className="p-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`relative p-3 mb-2 rounded-lg border border-gray-700/30 ${getBorderColor(notification.type)} ${
                    notification.read 
                      ? 'bg-gray-800/30' 
                      : 'bg-gray-800/50'
                  } hover:bg-gray-800/60 transition-colors group`}
                >
                  {/* Unread indicator */}
                  {!notification.read && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full"></div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`text-sm font-medium ${
                          notification.read ? 'text-gray-300' : 'text-white'
                        }`}>
                          {notification.title}
                        </h4>
                        
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-red-400"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className={`text-xs mt-1 ${
                        notification.read ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          {notification.time}
                        </div>
                        
                        {notification.action && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={notification.action.onClick}
                            className="h-6 text-xs bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600/50"
                          >
                            {notification.action.label}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t-2 border-gray-700/50">
            <Button
              variant="ghost"
              className="w-full text-center text-gray-400 hover:text-white text-sm"
              onClick={() => {
                onClose()
                // Navigate to full notifications page if needed
              }}
            >
              View all notifications
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default NotificationDropdown
