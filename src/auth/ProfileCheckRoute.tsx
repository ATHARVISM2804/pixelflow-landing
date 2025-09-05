import React, { useEffect, useState, ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import CompleteSignup from "@/components/CompleteSignup";

interface ProfileCheckRouteProps {
  children: ReactNode;
  requireProfileCompletion?: boolean;
}

const ProfileCheckRoute: React.FC<ProfileCheckRouteProps> = ({ 
  children, 
  requireProfileCompletion = true 
}) => {
  const { user, isLoading } = useAuth();
  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(null);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkProfileCompletion = async () => {
      if (!user) {
        setIsCheckingProfile(false);
        return;
      }
      
      try {
        const userProfileRef = doc(db, "userProfiles", user.uid);
        const profileSnap = await getDoc(userProfileRef);
        
        if (profileSnap.exists()) {
          const profileData = profileSnap.data();
          setIsProfileComplete(profileData.profileComplete === true);
        } else {
          setIsProfileComplete(false);
        }
      } catch (error) {
        console.error("Error checking profile completion:", error);
        setIsProfileComplete(false);
      } finally {
        setIsCheckingProfile(false);
      }
    };

    checkProfileCompletion();
  }, [user]);

  // Handle loading state
  if (isLoading || isCheckingProfile) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If profile completion is required and profile is not complete, show the form
  if (requireProfileCompletion && isProfileComplete === false) {
    if (!showCompleteProfile) {
      setShowCompleteProfile(true);
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <CompleteSignup onSkip={() => setShowCompleteProfile(false)} />
      </div>
    );
  }

  // If we get here, user is authenticated and (if required) profile is complete
  return <>{children}</>;
};

export default ProfileCheckRoute;
