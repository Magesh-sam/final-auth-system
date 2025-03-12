"use client";

import type React from "react";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
export function AuthForm() {
  const router = useRouter();
  const { login, register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const loginTabBtnRef = useRef<HTMLButtonElement>(null);
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const success = await login(username, password);

      if (success) {
        if (username === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      } else {
        toast.error("Login failed");
      }
    } catch (error) {
      toast.error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const success = await register(username, email, password);

      if (success) {
        toast.success("Registration successful");
        loginTabBtnRef.current?.click();
      } else {
        toast.error("Registration failed");
      }
    } catch (error) {
      toast.error("Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tabs defaultValue="login" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger ref={loginTabBtnRef} id="login-tab" value="login">
          Login
        </TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>

      <TabsContent value="login">
        <div className="rounded-lg border dark:bg-zinc-900 p-6 shadow-sm">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-username">Username</Label>
              <Input
                className="border-black dark:border-white focus:!border-2 focus:!border-blue-500"
                id="login-username"
                name="username"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>
              <Input
                className="border-black dark:border-white focus:!border-2 focus:!border-blue-500"
                id="login-password"
                name="password"
                type="password"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </div>
      </TabsContent>

      <TabsContent value="register">
        <div className="rounded-lg border dark:bg-zinc-900 p-6 shadow-sm">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="register-username">Username</Label>
              <Input
                className="border-black dark:border-white focus:!border-2 focus:!border-blue-500"
                id="register-username"
                name="username"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-email">Email</Label>
              <Input
                className="border-black dark:border-white focus:!border-2 focus:!border-blue-500"
                id="register-email"
                name="email"
                type="email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-password">Password</Label>
              <Input
                className="border-black dark:border-white focus:!border-2 focus:!border-blue-500"
                id="register-password"
                name="password"
                type="password"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </form>
        </div>
      </TabsContent>
    </Tabs>
  );
}
