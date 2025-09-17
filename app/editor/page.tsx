'use client'

import Editor from "@/pages/Editor";
import ProfileCheckRoute from "@/auth/ProfileCheckRoute";

export default function EditorPage() {
  return (
    <ProfileCheckRoute>
      <Editor />
    </ProfileCheckRoute>
  );
}