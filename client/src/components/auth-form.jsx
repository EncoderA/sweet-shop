"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";

export function AuthForm({ className, mode = "login", ...props }) {
  const router = useRouter();
  const [currentMode, setCurrentMode] = useState(mode);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: currentMode === "login" ? "ankush@gmail.com" : "",
    password: currentMode === "login" ? "Ankush@123" : "",
    confirmPassword: ""
  });

  useEffect(() => {
    setCurrentMode(mode);
    if (mode === "login") {
      setFormData({
        name: "",
        email: "ankush@gmail.com",
        password: "Ankush@123",
        confirmPassword: ""
      });
    } else {
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
      });
    }
  }, [mode]);

  const toggleMode = () => {
    const newMode = currentMode === "login" ? "register" : "login";
    router.push(newMode === "login" ? "/login" : "/register");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Login failed", {
          description: "Invalid email or password"
        });
      } else {
        toast.success("Login successful!", {
          description: "Welcome back to Sweet Delights"
        });
        router.push("/shop");
      }
    } catch (error) {
      toast.error("Login failed", {
        description: "Something went wrong. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Password mismatch", {
        description: "Passwords do not match"
      });
      setIsLoading(false);
      return;
    }

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
      const response = await axios.post(`${backendUrl}/api/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (response.data && response.data.success) {
        toast.success("Registration successful!", {
          description: "Please login with your credentials"
        });
        
        // Auto-fill login form with registered email
        setFormData(prev => ({
          ...prev,
          email: formData.email,
          password: formData.password
        }));
        
        router.push("/login");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Registration failed";
      toast.error("Registration failed", {
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isLogin = currentMode === "login";

  return (
    <div className="min-h-full flex items-center justify-center px-4">
      <div className={cn("flex flex-col gap-6 w-full max-w-4xl", className)} {...props}>
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            {/* Login Form - Left Side */}
            {isLogin && (
              <form onSubmit={handleLogin} className="p-6 md:p-8 flex items-center min-h-[500px] order-1">
                <div className="flex flex-col justify-center gap-6 w-full">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Welcome back</h1>
                    <p className="text-muted-foreground text-balance">
                      Login to your Sweet Delights account
                    </p>
                  </div>

                  {/* Quick login presets */}
                  <div className="grid gap-2">
                    <div className="text-xs text-gray-500">Quick login</div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="text-xs"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          email: "ankush@gmail.com",
                          password: "Ankush@123"
                        }))}
                      >
                        Use Admin
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="text-xs"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          email: "test@gmail.com",
                          password: "Test@123"
                        }))}
                      >
                        Use User
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <a
                        href="#"
                        className="ml-auto text-sm underline-offset-2 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <Input 
                      id="password" 
                      name="password"
                      type="password" 
                      value={formData.password}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full hover:cursor-pointer"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>

                  <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="underline hover:cursor-pointer underline-offset-4 hover:text-primary font-medium"
                    >
                      Sign up
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Image - Center (slides left/right) */}
            <div 
              className={cn(
                "bg-muted relative hidden md:block transition-all duration-500 ease-in-out",
                isLogin ? "order-2" : "order-1"
              )}
            >
              <div className="relative rounded-xl overflow-hidden min-h-[500px] flex items-center justify-center p-8 text-center">
                <div className="absolute inset-0">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDd6IL5MCi_u4Z_urYZgyneA-cyBSmLh9yM2MDaPj4KAlA03Xo_wnqDK1nBSJfxhcZM-S5pCZIcW5J5KuGRhnPQuimLGIxTdIg_VYBDCL5P7GSNLvzp9GEgZYjNnocmVkAruECEZo7C6fFva50L_Pl8WsaMFJNn74OlRGY8INhJ4AyvHGeic0MArMfj5ykQkRe31hHWWZbXsPrFdECNV43T6n9X5_ZllHHNRWg4qWcNCzWxE0QKEAZd8NqqLrNKpHJ2u_R6tvfxQh7Z"
                    alt="Sweet shop hero"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[rgba(34,16,25,0.5)] to-[rgba(34,16,25,0.7)]" />
                </div>

                <div className="relative flex flex-col gap-6 max-w-2xl text-white z-10">
                  <h1 className="text-xl md:text-4xl font-extrabold leading-tight">
                    {isLogin 
                      ? "Indulge in Sweet Delights" 
                      : "Join Our Sweet Community"
                    }
                  </h1>
                  {/* <p className="text-lg opacity-90">
                    {isLogin 
                      ? "Discover the finest collection of handcrafted sweets and treats"
                      : "Start your journey with the sweetest treats and exclusive offers"
                    }
                  </p> */}
                </div>
              </div>
            </div>

            {/* Register Form - Right Side */}
            {!isLogin && (
              <form onSubmit={handleRegister} className="px-3 md:px-8 flex items-center min-h-[500px] order-2">
                <div className="flex flex-col justify-center gap-4 w-full">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Create Account</h1>
                    <p className="text-muted-foreground text-sm">
                      Sign up for your Sweet Delights
                    </p>
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      name="password"
                      type="password" 
                      value={formData.password}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Sign Up"}
                  </Button>

                  <div className="text-center text-sm">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="underline underline-offset-4 hover:text-primary font-medium"
                    >
                      Login
                    </button>
                  </div>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
}