"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser, setLoading, isLoading, user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
          if (
            !pathname.startsWith("/login") &&
            !pathname.startsWith("/signup") &&
            pathname !== "/"
          ) {
            router.push("/login");
          }
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [setUser, setLoading, router, pathname]);

  useEffect(() => {
    if (!isLoading && user) {
      if (pathname === "/login" || pathname === "/signup" || pathname === "/") {
        const isEmployee =
          user.role === "ACCOUNT_MANAGER" ||
          user.role === "DEPARTMENT_EMPLOYEE" ||
          user.role === "EXECUTIVE";
        router.push(isEmployee ? "/employee" : "/dashboard");
      }
    }
  }, [isLoading, user, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
