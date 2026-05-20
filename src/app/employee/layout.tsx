"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";

export default function EmployeeDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
