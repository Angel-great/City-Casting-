"use client";

import { useAuthStore } from "@/lib/store";
import Card from "@/components/ui/Card";
import { PAYMENT_TERMS, ROLES } from "@/lib/constants";

export default function ProfilePage() {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Account Information">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Name</label>
              <p className="font-medium">
                {user.firstName} {user.lastName}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <p className="font-medium">{user.email}</p>
            </div>
            {user.companyName && (
              <div>
                <label className="text-sm text-gray-500">Company</label>
                <p className="font-medium">{user.companyName}</p>
              </div>
            )}
            {user.phone && (
              <div>
                <label className="text-sm text-gray-500">Phone</label>
                <p className="font-medium">{user.phone}</p>
              </div>
            )}
            <div>
              <label className="text-sm text-gray-500">Role</label>
              <p className="font-medium">
                {ROLES[user.role as keyof typeof ROLES] || user.role}
              </p>
            </div>
          </div>
        </Card>

        <Card title="Account Details">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Customer Code</label>
              <p className="font-mono text-lg font-bold text-amber-700">
                {user.customerCode}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Payment Terms</label>
              <p className="font-medium">
                {PAYMENT_TERMS[
                  (user.paymentTerms as keyof typeof PAYMENT_TERMS) || "COD"
                ] || user.paymentTerms}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Credit Limit</label>
              <p className="font-medium">
                $
                {(user.creditLimit || 0).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
