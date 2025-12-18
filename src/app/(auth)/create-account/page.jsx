"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Mail, User, Lock ,LoaderIcon} from "lucide-react";
import Link from "next/link";
import GlobalApi from "@/app/_utils/GlobalApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function CreateAccount() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router=useRouter();

  useEffect(() => {   
    const jwt = sessionStorage.getItem("jwt");
    if (jwt) {
      router.push("/");
    }
  }, [router]);

  const onCreateAccount = () => {
    setLoading(true);
    
    GlobalApi.registerUser(username, email, password)
      .then(resp => {
        console.log("Registration Successful:", resp);
        sessionStorage.setItem("user", JSON.stringify( resp.user ));
        toast("Account created successfully!");
        sessionStorage.setItem('jwt', resp.jwt);
        router.push('/');

      },(e)=>{
        toast("Error while creating account. Please try again.");
      })
      .catch(error => {
        console.log("Error during account creation:", error);
        
        if (error.response?.data?.error?.message) {
          alert("Error: " + error.response.data.error.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateAccount();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image src="/LOGO.png" alt="Logo" width={120} height={120} />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-6 text-primary">
          Create Account
        </h1>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Username */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">Username</label>
            <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-green-500">
              <User className="text-gray-500" size={20} />
              <input
                type="text"
                className="w-full outline-none"
                placeholder="Enter your username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-gray-700 font-medium mb-1">Email</label>
            <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-green-500">
              <Mail className="text-gray-500" size={20} />
              <input
                type="email"
                className="w-full outline-none"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-700 font-medium mb-1">Password</label>
            <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-green-500">
              <Lock className="text-gray-500" size={20} />
              <input
                type="password"
                className="w-full outline-none"
                placeholder="Enter your password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-700 transition duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center"
            disabled={!username || !email || !password || loading}
          >
                        {loading?<LoaderIcon className="animate-spin mx-auto" size={24}/>:
            "Create Account"}
          </button>
        </form>

        {/* Already have account */}
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-green-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default CreateAccount;