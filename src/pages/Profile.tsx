'use client'

import { useState, useRef, useEffect } from 'react'
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
import { cardApi } from '../services/cardApi'
import Sidebar from "@/components/Sidebar"
import DashboardHeader from "@/components/DashboardHeader"
import React from 'react'
import axios from "axios"
// Firestore imports
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from '../auth/firebase'
import { useToast } from '@/hooks/use-toast'
import { updateProfile } from 'firebase/auth'
import { auth } from '../auth/firebase'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export function Profile() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [cardsCreated, setCardsCreated] = useState<number>(0)
  const [transactionCount, setTransactionCount] = useState<number>(0)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    dateOfBirth: '',
    bio: '',
    occupation: '',
    profileComplete: false
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
    // Special handling for phone number to allow only numeric input
    if (field === 'phone') {
      // Remove any non-numeric characters
      const numericValue = value.replace(/\D/g, '');
      // Limit to 10 digits
      const limitedValue = numericValue.slice(0, 10);
      setProfileData(prev => ({ ...prev, [field]: limitedValue }));
    } else {
      setProfileData(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleSave = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Validate phone number length if provided
      if (profileData.phone && profileData.phone.length !== 10) {
        toast({
          title: "Invalid Phone Number",
          description: "Phone number must be exactly 10 digits",
          variant: "destructive",
        });
        return;
      }

      // Check if profile would be complete after this save
      const isComplete = !!(
        profileData.phone &&
        profileData.address &&
        profileData.dateOfBirth
      );

      // Save to Firestore
      const userProfileRef = doc(db, "userProfiles", user.uid);
      await setDoc(userProfileRef, {
        ...profileData,
        phoneNumber: profileData.phone,
        profileComplete: isComplete,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      // Update Firebase Authentication profile
      try {
        await updateProfile(auth.currentUser, {
          displayName: profileData.displayName,
          photoURL: imagePreview || null
        });
        
        // If we have a new profile image as File object, we could upload it to Firebase Storage here
        // and then update the profile with the storage URL
        if (profileImage) {
          // Code for uploading to Firebase Storage would go here if needed
          // Then update the photoURL with the storage URL
        }
      } catch (err) {
        console.warn("Firebase Auth profile update failed:", err);
        // Continue with the function - Firestore update is more important
      }

      // Update local state
      setProfileData(prev => ({
        ...prev,
        profileComplete: isComplete
      }));

      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully.",
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleCancel = () => {
    // Fetch the latest profile data from Firestore
    fetchUserProfile()
    setImagePreview(user?.photoURL || null)
    setIsEditing(false)
  }

  // Function to fetch user profile from Firestore
  const fetchUserProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const userProfileRef = doc(db, "userProfiles", user.uid);
      const profileSnap = await getDoc(userProfileRef);
      
      if (profileSnap.exists()) {
        // Get the user profile data
        const userData = profileSnap.data();
        
        // Update the profile data state with fetched data
        setProfileData({
          displayName: user.displayName || userData.displayName || '',
          email: user.email || userData.email || '',
          phone: userData.phoneNumber || '', // This matches the field name in CompleteSignup
          address: userData.address || '',
          dateOfBirth: userData.dateOfBirth || '',
          bio: userData.bio || 'No bio provided',
          occupation: userData.occupation || 'User',
          profileComplete: userData.profileComplete || false
        });
      } else {
        // Profile doesn't exist, use defaults
        setProfileData({
          displayName: user.displayName || '',
          email: user.email || '',
          phone: '',
          address: '',
          dateOfBirth: '',
          bio: 'No bio provided',
          occupation: 'User',
          profileComplete: false
        });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast({
        title: "Error",
        description: "Failed to load your profile information.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user profile data when component mounts
  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);
  
  // fetch user's transactions using cardApi
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        if (!user?.uid) return;
        const transactions = await cardApi.getCardsByUser(user.uid); // returns only CARD_CREATION txs
        setCardsCreated(transactions.length);
        // If you want total transactions (all types) modify cardApi or call another endpoint.
        setTransactionCount(transactions.length);
      } catch (err) {
        console.error('Failed to load transactions for profile stats', err);
      }
    };

    fetchTransactions();
  }, [user]);

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
                  {/* <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                    Active User
                  </Badge> */}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Mail className="h-4 w-4 text-indigo-400" />
                    <span className="text-sm">{profileData.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Phone className="h-4 w-4 text-green-400" />
                    <span className="text-sm">{profileData.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <MapPin className="h-4 w-4 text-orange-400" />
                    <span className="text-sm">{profileData.address || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Calendar className="h-4 w-4 text-purple-400" />
                    <span className="text-sm">{profileData.dateOfBirth ? `DOB: ${new Date(profileData.dateOfBirth).toLocaleDateString()}` : 'DOB: Not provided'}</span>
                  </div>
                  <div className="mt-2">
                    {profileData.profileComplete ? (
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                        Profile Complete
                      </Badge>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 inline-block mb-2">
                          Profile Incomplete
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 border-indigo-500/30"
                          onClick={() => window.location.href = '/complete-profile'}
                        >
                          Complete Your Profile
                        </Button>
                      </div>
                    )}
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
                    <span className="text-white font-semibold">{cardsCreated}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-green-400" />
                      <span className="text-gray-300 text-sm">Total Transactions</span>
                    </div>
                    <span className="text-white font-semibold">{transactionCount}</span>
                  </div>
                  {/* <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-purple-400" />
                      <span className="text-gray-300 text-sm">Account Security</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
                      Verified
                    </Badge>
                  </div> */}
                </CardContent>
              </Card>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2">
              <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-xl">Profile Information</CardTitle>
                    {isLoading ? (
                      <div className="text-gray-400 text-sm">Loading...</div>
                    ) : !isEditing ? (
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
                          disabled={isLoading}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {isLoading ? "Saving..." : "Save"}
                        </Button>
                        <Button
                          onClick={handleCancel}
                          variant="outline"
                          className="bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50"
                          disabled={isLoading}
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
                            disabled
                          />
                        ) : (
                          <p className="mt-1 text-gray-300 p-2">{profileData.email}</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-white text-sm">Phone Number</Label>
                        {isEditing ? (
                          <div>
                            <Input
                              value={profileData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              className={`mt-1 bg-gray-800/50 border-gray-700/50 text-white ${
                                profileData.phone && profileData.phone.length !== 10 
                                  ? 'border-red-500 focus:border-red-500' 
                                  : ''
                              }`}
                              type="tel"
                              pattern="[0-9]{10}"
                              minLength={10}
                              maxLength={10}
                              placeholder="Enter 10-digit phone number"
                            />
                            {profileData.phone && profileData.phone.length !== 10 && (
                              <p className="text-red-400 text-xs mt-1">
                                Phone number must be exactly 10 digits ({profileData.phone.length}/10)
                              </p>
                            )}
                          </div>
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
                          <p className="mt-1 text-gray-300 p-2">{profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toLocaleDateString() : 'Not provided'}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div>
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

