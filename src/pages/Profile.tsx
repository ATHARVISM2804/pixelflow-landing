import React, { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit3, 
  Save, 
  X, 
  Upload,
  Shield,
  Bell,
  Settings,
  CreditCard,
  Activity
} from "lucide-react"
import { useAuth } from '../auth/AuthContext'
import Sidebar from "@/components/Sidebar"
import DashboardHeader from "@/components/DashboardHeader"

export function Profile() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    phone: '+91 9876543210',
    address: 'Mumbai, Maharashtra, India',
    dateOfBirth: '1990-01-01',
    bio: 'Professional ID card creator and document specialist.',
    occupation: 'Graphic Designer'
  })
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(user?.photoURL || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfileImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerImageUpload = () => {
    fileInputRef.current?.click()
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    // Here you would typically save to backend
    console.log('Saving profile data:', profileData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    // Reset to original data
    setProfileData({
      displayName: user?.displayName || '',
      email: user?.email || '',
      phone: '+91 9876543210',
      address: 'Mumbai, Maharashtra, India',
      dateOfBirth: '1990-01-01',
      bio: 'Professional ID card creator and document specialist.',
      occupation: 'Graphic Designer'
    })
    setImagePreview(user?.photoURL || null)
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
      <Sidebar />

      <div className="lg:ml-[280px] flex flex-col min-h-screen">
        <DashboardHeader title="User Profile" icon={User} showNewServiceButton={false} />

        <main className="flex-1 p-3 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Summary Card */}
            <div className="lg:col-span-1">
              <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
                <CardHeader className="text-center">
                  <div className="relative mx-auto w-24 h-24 sm:w-32 sm:h-32">
                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                      {imagePreview ? (
                        <img 
                          src={imagePreview} 
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
                      )}
                    </div>
                    {isEditing && (
                      <Button
                        size="sm"
                        onClick={triggerImageUpload}
                        className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-indigo-500 hover:bg-indigo-600 p-0"
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                  <CardTitle className="text-white text-xl mt-4">{profileData.displayName}</CardTitle>
                  <p className="text-gray-400">{profileData.occupation}</p>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                    Active User
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Mail className="h-4 w-4 text-indigo-400" />
                    <span className="text-sm">{profileData.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Phone className="h-4 w-4 text-green-400" />
                    <span className="text-sm">{profileData.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <MapPin className="h-4 w-4 text-orange-400" />
                    <span className="text-sm">{profileData.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Calendar className="h-4 w-4 text-purple-400" />
                    <span className="text-sm">Joined December 2023</span>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Card */}
              <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 mt-6">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Account Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-blue-400" />
                      <span className="text-gray-300 text-sm">Cards Created</span>
                    </div>
                    <span className="text-white font-semibold">24</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-green-400" />
                      <span className="text-gray-300 text-sm">Total Transactions</span>
                    </div>
                    <span className="text-white font-semibold">156</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-purple-400" />
                      <span className="text-gray-300 text-sm">Account Security</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
                      Verified
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2">
              <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-xl">Profile Information</CardTitle>
                    {!isEditing ? (
                      <Button
                        onClick={() => setIsEditing(true)}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white"
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSave}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          onClick={handleCancel}
                          variant="outline"
                          className="bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-white font-semibold mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-white text-sm">Full Name</Label>
                        {isEditing ? (
                          <Input
                            value={profileData.displayName}
                            onChange={(e) => handleInputChange('displayName', e.target.value)}
                            className="mt-1 bg-gray-800/50 border-gray-700/50 text-white"
                          />
                        ) : (
                          <p className="mt-1 text-gray-300 p-2">{profileData.displayName}</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-white text-sm">Email Address</Label>
                        {isEditing ? (
                          <Input
                            value={profileData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="mt-1 bg-gray-800/50 border-gray-700/50 text-white"
                            type="email"
                          />
                        ) : (
                          <p className="mt-1 text-gray-300 p-2">{profileData.email}</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-white text-sm">Phone Number</Label>
                        {isEditing ? (
                          <Input
                            value={profileData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="mt-1 bg-gray-800/50 border-gray-700/50 text-white"
                          />
                        ) : (
                          <p className="mt-1 text-gray-300 p-2">{profileData.phone}</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-white text-sm">Date of Birth</Label>
                        {isEditing ? (
                          <Input
                            value={profileData.dateOfBirth}
                            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                            className="mt-1 bg-gray-800/50 border-gray-700/50 text-white"
                            type="date"
                          />
                        ) : (
                          <p className="mt-1 text-gray-300 p-2">{new Date(profileData.dateOfBirth).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div>
                    {/* <h3 className="text-white font-semibold mb-4">Additional Information</h3> */}
                    <div className="space-y-4">
                      <div>
                        <Label className="text-white text-sm">Address</Label>
                        {isEditing ? (
                          <Input
                            value={profileData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            className="mt-1 bg-gray-800/50 border-gray-700/50 text-white"
                          />
                        ) : (
                          <p className="mt-1 text-gray-300 p-2">{profileData.address}</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-white text-sm">Occupation</Label>
                        {isEditing ? (
                          <Input
                            value={profileData.occupation}
                            onChange={(e) => handleInputChange('occupation', e.target.value)}
                            className="mt-1 bg-gray-800/50 border-gray-700/50 text-white"
                          />
                        ) : (
                          <p className="mt-1 text-gray-300 p-2">{profileData.occupation}</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-white text-sm">Bio</Label>
                        {isEditing ? (
                          <Textarea
                            value={profileData.bio}
                            onChange={(e) => handleInputChange('bio', e.target.value)}
                            className="mt-1 bg-gray-800/50 border-gray-700/50 text-white h-24"
                            placeholder="Tell us about yourself..."
                          />
                        ) : (
                          <p className="mt-1 text-gray-300 p-2">{profileData.bio}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Account Settings */}
                  {/* <div>
                    <h3 className="text-white font-semibold mb-4">Account Settings</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Bell className="h-4 w-4 text-blue-400" />
                          <span className="text-gray-300">Email Notifications</span>
                        </div>
                        <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                          Enabled
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Shield className="h-4 w-4 text-purple-400" />
                          <span className="text-gray-300">Two-Factor Authentication</span>
                        </div>
                        <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
                          Disabled
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Settings className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-300">Account Privacy</span>
                        </div>
                        <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                          Private
                        </Badge>
                      </div>
                    </div>
                  </div> */}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Profile
