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
  const [loading, setLoading] = useState(true);

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

    // Set avatar preview ONLY from localStorage (frontend-only avatars)
    const storedAvatar = localStorage.getItem(`avatar_${u.id}`);
    
    // Validate it's a proper blob or data URL
    const isValidAvatar = storedAvatar && 
      (storedAvatar.startsWith('blob:http://') || 
       storedAvatar.startsWith('blob:https://') ||
       storedAvatar.startsWith('data:image/'));
    
    setAvatarPreview(isValidAvatar ? storedAvatar : "");
    setLoading(false);
  }, [router]);

  // Cleanup blob URLs on unmount
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

  // Set avatar preview from localStorage (now base64)
  const storedAvatar = localStorage.getItem(`avatar_${u.id}`);
  
  // Check if it's a valid base64 data URL
  const isValidBase64 = storedAvatar && 
    storedAvatar.startsWith('data:image/') && 
    storedAvatar.includes(';base64,');
  
  setAvatarPreview(isValidBase64 ? storedAvatar : "");
  setLoading(false);
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
  
  // Create a FileReader to convert to base64
  const reader = new FileReader();
  
  reader.onload = (event) => {
    const base64Image = event.target.result; // data:image/jpeg;base64,/9j/4AAQ...
    setAvatarPreview(base64Image);
    
    // Store base64 in localStorage for persistence
    if (user?.id) {
      try {
        localStorage.setItem(`avatar_${user.id}`, base64Image);
      } catch (storageError) {
        // Base64 might be too large for localStorage
        if (storageError.name === 'QuotaExceededError') {
          toast.error("Image too large for local storage. Please use a smaller image.");
        } else {
          toast.warning("Avatar saved locally but may not persist");
        }
      }
    }
  };
  
  reader.onerror = () => {
    toast.error("Failed to read image file");
  };
  
  // Read the file as data URL (base64)
  reader.readAsDataURL(file);
};

  const onChange = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  // Phone validation function
  const validatePhone = (phone) => {
    if (!phone) return true; // Phone is optional
    const phoneRegex = /^[0-9+\-\s()]{8,15}$/;
    return phoneRegex.test(phone);
  };

  const handleSave = async () => {
    // Basic validation
    if (!form.fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    if (form.phone && !validatePhone(form.phone)) {
      toast.error("Please enter a valid phone number (8-15 digits)");
      return;
    }

    if (!jwt || !user?.id) return;

    setSaving(true);
    try {
      // 1) Prepare update data WITHOUT avatar (frontend-only avatars)
      const updateData = {
        username: form.fullName.trim(), // Strapi uses 'username' field
        phone: form.phone.trim() || null,
        bio: form.bio.trim() || null,
      };

      // 2) Update user profile (text data only to Strapi)
      const updated = await GlobalApi.updateUserProfile(user.id, updateData, jwt);

      // 3) Update local storage
      const merged = { 
        ...user, 
        ...updated,
        // Keep existing data, don't add avatarPreview to user object
      };
      
      // Save to sessionStorage WITHOUT avatar in user object
      sessionStorage.setItem("user", JSON.stringify(merged));
      setUser(merged);

      // 4) Trigger event to update header
      window.dispatchEvent(new Event('profile-updated'));
      
      // Avatar is already stored in localStorage from onFileChange
      // No need to store it again here
      
      toast.success("Profile updated successfully!");
      
      // Redirect after short delay
      setTimeout(() => {
        router.push("/");
      }, 1000);
      
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error("Failed to update profile: " + (err.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-72px)] bg-slate-200 flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg px-6 sm:px-10 py-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-200 flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg px-6 sm:px-10 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-primary">Edit Profile</h1>

        {/* Avatar */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="relative">
            <div className="h-28 w-28 rounded-full overflow-hidden border-4 border-white shadow relative">
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="Profile photo"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    console.error("Failed to load avatar:", avatarPreview);
                    
                    // Revoke blob URL to prevent memory leaks
                    if (avatarPreview && avatarPreview.startsWith('blob:')) {
                      URL.revokeObjectURL(avatarPreview);
                      setAvatarPreview("");
                      if (user?.id) {
                        localStorage.removeItem(`avatar_${user.id}`);
                      }
                    }
                    
                    // Hide the image and show fallback
                    e.target.style.display = 'none';
                    const parent = e.target.parentElement;
                    if (parent) {
                      const fallback = document.createElement('div');
                      fallback.className = 'h-full w-full bg-slate-100 flex items-center justify-center text-slate-400';
                      fallback.textContent = 'No Photo';
                      parent.appendChild(fallback);
                    }
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
            <label className="text-sm font-semibold">Full Name *</label>
            <Input
              value={form.fullName}
              onChange={onChange("fullName")}
              placeholder="Your name"
              className="mt-2"
              required
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
            {form.phone && !validatePhone(form.phone) && (
              <p className="text-xs text-red-500 mt-1">
                Please enter a valid phone number (8-15 digits)
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold flex justify-between">
              <span>Bio</span>
              <span className="text-xs font-normal text-gray-500">
                {form.bio.length}/200
              </span>
            </label>
            <Textarea
              value={form.bio}
              onChange={(e) => {
                if (e.target.value.length <= 200) {
                  setForm(prev => ({ ...prev, bio: e.target.value }));
                }
              }}
              placeholder="Write something about you..."
              className="mt-2 min-h-[110px]"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Email</label>
            <Input 
              value={form.email || user?.email || ""} 
              readOnly 
              className="mt-2 bg-slate-50" 
            />
            <p className="text-xs text-slate-500 mt-1">Email is read-only.</p>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              onClick={() => router.back()}
              variant="outline"
              className="w-60 h-12 text-base font-semibold"
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-60 h-12 text-base font-semibold bg-primary hover:bg-primary-dark"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}