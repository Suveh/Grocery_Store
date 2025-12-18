"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, KeyRound, HelpCircle, UserPlus, LoaderIcon } from "lucide-react";
import GlobalApi from "@/app/_utils/GlobalApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function LoginPage() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const router=useRouter();

    useEffect(() => {   
        const jwt = sessionStorage.getItem("jwt");
        if (jwt) {
          router.push("/");
        }
      }, [router]);

    const onSignIn = (e) => {
      if (e) e.preventDefault();

      setLoading(true);
      GlobalApi.SignIn(email, password)
        .then((resp) => {
          console.log("Login Successful:", resp);
          sessionStorage.setItem("user", JSON.stringify(resp.user));
          sessionStorage.setItem("jwt", resp.jwt);
          toast.success("Login successful!");
          router.push("/");
        })
        .catch((error) => {
          console.log("Error during sign in:", error);
          toast.error(
            "Error while signing in. Please check your credentials and try again."
          );
        })
        .finally(() => {
          setLoading(false);
        });
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image src="/LOGO.png" alt="Logo" width={120} height={120} />
        </div>

        <h1 className="text-3xl font-bold text-center text-primary mb-6">
          Login
        </h1>

        <form className="space-y-5" onSubmit={onSignIn}>

          {/* Email Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email Address
            </label>

            <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-green-500">
              <Mail className="text-gray-500" size={20} />
              <input
                type="email"
                className="w-full outline-none"
                required
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>

            <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-green-500">
              <KeyRound className="text-gray-500" size={20} />
              <input
                type="password"
                className="w-full outline-none"
                required
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Forgot password & Create account — SAME LEVEL */}
          <div className="flex justify-between items-center text-sm mt-1">
            <Link href="/forgot-password" className="flex items-center gap-1 text-green-600 hover:underline">
              <HelpCircle size={16} />
              Forgot Password
            </Link>

            <Link href="/create-account" className="flex items-center gap-1 text-green-600 hover:underline">
              <UserPlus size={16} />
              Create Account
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg text-lg
            font-semibold hover:bg-green-700 transition"
            onClick={()=>onSignIn()}
            disabled={ !email || !password || loading }
          >
            {loading?<LoaderIcon className="animate-spin mx-auto" size={24}/>:
            "Login"}
          </button>
        </form>

      </div>
    </div>
  );
}

export default LoginPage;
