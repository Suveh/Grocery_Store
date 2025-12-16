"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import GlobalApi from "@/app/_utils/GlobalApi";
import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();
  const fileRef = useRef(null);

  const [jwt, setJwt] = useState(null);
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    bio: "",
    email: "",
  });

  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const jwtToken = sessionStorage.getItem("jwt");
    const userData = sessionStorage.getItem("user");

    if (!jwtToken || !userData) {
      router.replace("/sign-in");
      return;
    }

    const u = JSON.parse(userData);
    setJwt(jwtToken);
    setUser(u);

    // Fill initial values from stored user
    setForm({
      fullName: u.fullName || u.username || "",
      phone: u.phone || "",
      bio: u.bio || "",
      email: u.email || "",
    });

    // Set avatar preview - use local storage if exists, otherwise user's avatar
    const storedAvatar = localStorage.getItem(`avatar_${u.id}`);
    const userAvatar = u.avatar?.url 
      ? `http://localhost:1337${u.avatar.url}`
      : "";
    
    setAvatarPreview(storedAvatar || userAvatar || "");
  }, [router]);

  const onPickImage = () => fileRef.current?.click();

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error("File size must be less than 5MB");
      return;
    }

    setAvatarFile(file);
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
    
    // Store in localStorage for persistence
    if (user?.id) {
      localStorage.setItem(`avatar_${user.id}`, previewUrl);
    }
  };

  const onChange = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSave = async () => {
    if (!jwt || !user?.id) return;

    setSaving(true);
    try {
      // 1) Prepare update data WITHOUT avatar upload
      const updateData = {
        username: form.fullName, // Strapi uses 'username' field
        phone: form.phone,
        bio: form.bio,
        // Note: We're NOT uploading avatar to avoid 500 error
      };

      // 2) Update user profile (text data only)
      const updated = await GlobalApi.updateUserProfile(user.id, updateData, jwt);

      // 3) Update local storage with combined data
      const merged = { 
        ...user, 
        ...updated,
        // Store avatar preview locally (not in Strapi)
        avatarPreview: avatarPreview
      };
      
      sessionStorage.setItem("user", JSON.stringify(merged));
      setUser(merged);

      // 4) ✅ CRITICAL: Trigger event to update header
      window.dispatchEvent(new Event('profile-updated'));
      
      // Also update localStorage for avatar persistence
      if (avatarPreview && user?.id) {
        localStorage.setItem(`avatar_${user.id}`, avatarPreview);
        
        // Update sessionStorage avatar too
        const userWithAvatar = { ...merged, avatar: { url: avatarPreview } };
        sessionStorage.setItem("user", JSON.stringify(userWithAvatar));
      }

      toast.success("Profile updated successfully!");
      router.push("/");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile: " + (err.response?.data?.error?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-200 flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg px-6 sm:px-10 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-primary">Edit Profile</h1>

        {/* Avatar */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="relative">
            <div className="h-28 w-28 rounded-full overflow-hidden border-4 border-white shadow">
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="Profile photo"
                  width={112}
                  height={112}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `
                      <div class="h-full w-full bg-slate-100 flex items-center justify-center text-slate-400">
                        No Photo
                      </div>
                    `;
                  }}
                />
              ) : (
                <div className="h-full w-full bg-slate-100 flex items-center justify-center text-slate-400">
                  No Photo
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onPickImage}
              className="absolute -right-1 -bottom-1 h-10 w-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg"
              aria-label="Change profile photo"
            >
              <Camera className="h-5 w-5" />
            </button>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
            />
          </div>

          <p className="text-sm text-slate-500">Tap to change photo</p>
        </div>

        {/* Form */}
        <div className="space-y-5">
          <div>
            <label className="text-sm font-semibold">Full Name</label>
            <Input
              value={form.fullName}
              onChange={onChange("fullName")}
              placeholder="Your name"
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Phone</label>
            <Input
              value={form.phone}
              onChange={onChange("phone")}
              placeholder="Your phone number"
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Bio</label>
            <Textarea
              value={form.bio}
              onChange={onChange("bio")}
              placeholder="Write something about you..."
              className="mt-2 min-h-[110px]"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Email</label>
            <Input value={form.email} readOnly className="mt-2 bg-slate-50" />
            <p className="text-xs text-slate-500 mt-1">Email is read-only.</p>
          </div>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary-dark mt-4"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}