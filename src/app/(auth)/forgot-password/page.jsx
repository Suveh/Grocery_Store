"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import {toast} from "sonner";
import GlobalApi from "@/app/_utils/GlobalApi";

function ForgotPassword() {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit=async(e)=>{
    e.preventDefault();
    
    if(!email){
      toast.error("Please enter your email address.");
      return;
    }

    setLoading(true);
    try{
      GlobalApi.forgotPassword(email);
      console.log("Password reset requested for:", email);
      toast.success("Password reset link sent to your email.");
    }catch(error){
      console.error("Error sending reset link:",error);
      toast.error("Failed to send reset link. Please try again.");
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image src="/LOGO.png" alt="Logo" width={120} height={120} />
        </div>

        <h1 className="text-3xl font-bold text-center mb-4 text-primary">
          Reset Password
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Enter your email and we’ll send you a password reset link.
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>

          {/* Email Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email Address
            </label>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg 
                focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="example@gmail.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-700 transition"
            disabled={loading || !email}
          >
            {loading?<LoaderIcon className="animate-spin mx-auto" size={24}/>:
            "Send Reset Link"}
          </button>
        </form>

        {/* Back to Login */}
        <p className="text-center text-gray-600 mt-4 flex justify-center items-center gap-1">
          <ArrowLeft className="h-4 w-4 text-green-600" />
          <Link href="/sign-in" className="text-green-600 font-semibold hover:underline">
            Back to Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default ForgotPassword;
