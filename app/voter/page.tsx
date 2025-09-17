'use client'

import Voter from "@/pages/Voter";
import ProfileCheckRoute from "@/auth/ProfileCheckRoute";

export default function VoterPage() {
  return (
    <ProfileCheckRoute>
      <Voter />
    </ProfileCheckRoute>
  );
}