"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuthStore } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [loginMode, setLoginMode] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [customerCode, setCustomerCode] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const body =
        loginMode === "email"
          ? { email, password }
          : { customerCode, pin };

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      setUser(data.user);

      const isEmployee =
        data.user.role === "ACCOUNT_MANAGER" ||
        data.user.role === "DEPARTMENT_EMPLOYEE" ||
        data.user.role === "EXECUTIVE";

      router.push(isEmployee ? "/employee" : "/dashboard");
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-amber-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-amber-400">
            City Casting Corp
          </h1>
          <p className="text-gray-400 mt-2">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setLoginMode("email")}
              className={`flex-1 py-2 text-sm rounded-md transition-colors ${
                loginMode === "email"
                  ? "bg-white shadow text-amber-700 font-semibold"
                  : "text-gray-600"
              }`}
            >
              Email Login
            </button>
            <button
              onClick={() => setLoginMode("code")}
              className={`flex-1 py-2 text-sm rounded-md transition-colors ${
                loginMode === "code"
                  ? "bg-white shadow text-amber-700 font-semibold"
                  : "text-gray-600"
              }`}
            >
              Customer Code
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {loginMode === "email" ? (
              <>
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@company.com"
                />
                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
              </>
            ) : (
              <>
                <Input
                  label="Customer Code"
                  value={customerCode}
                  onChange={(e) => setCustomerCode(e.target.value)}
                  required
                  placeholder="CC-XXXXXX"
                />
                <Input
                  label="PIN"
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  required
                  placeholder="4-digit PIN"
                  maxLength={4}
                />
              </>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-amber-600 hover:text-amber-700 font-medium"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
