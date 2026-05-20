"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import Badge from "@/components/ui/Badge";
import { ORDER_TYPES, ORDER_STATUSES, DEPARTMENTS } from "@/lib/constants";
import { format } from "date-fns";

interface Order {
  id: string;
  orderNumber: string;
  orderType: string;
  status: string;
  currentDept?: string | null;
  createdAt: string;
  customer: {
    firstName: string;
    lastName: string;
    companyName?: string | null;
  };
  _count: { items: number };
}

export default function DepartmentsPage() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedDept, setSelectedDept] = useState(
    user?.department && user.department !== "ADMIN"
      ? user.department
      : "CASTING"
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders?limit=100")
      .then((r) => r.json())
      .then((data) => {
        setOrders(data.orders || []);
        setLoading(false);
      });
  }, []);

  const deptOrders = orders.filter((o) => o.currentDept === selectedDept);
  const deptCounts = DEPARTMENTS.reduce(
    (acc, dept) => {
      acc[dept] = orders.filter((o) => o.currentDept === dept).length;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Department View
      </h1>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {DEPARTMENTS.map((dept) => (
          <button
            key={dept}
            onClick={() => setSelectedDept(dept)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedDept === dept
                ? "bg-amber-600 text-white"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {dept.replace("_", " ")}
            {deptCounts[dept] > 0 && (
              <span
                className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                  selectedDept === dept
                    ? "bg-amber-700 text-amber-100"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {deptCounts[dept]}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : deptOrders.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No orders currently in {selectedDept.replace("_", " ")} department
        </div>
      ) : (
        <div className="space-y-3">
          {deptOrders.map((order) => (
            <Link
              key={order.id}
              href={`/employee/orders/${order.id}`}
              className="block bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-amber-600">
                    {order.orderNumber}
                  </p>
                  <p className="text-sm text-gray-700">
                    {order.customer.companyName ||
                      `${order.customer.firstName} ${order.customer.lastName}`}
                  </p>
                  <p className="text-xs text-gray-500">
                    {ORDER_TYPES[order.orderType as keyof typeof ORDER_TYPES]} -{" "}
                    {order._count.items} item(s)
                  </p>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      order.status === "DELIVERED"
                        ? "success"
                        : order.status === "CANCELLED"
                          ? "danger"
                          : "warning"
                    }
                  >
                    {ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES] || order.status}
                  </Badge>
                  <p className="text-xs text-gray-400 mt-1">
                    {format(new Date(order.createdAt), "MMM dd, yyyy")}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
