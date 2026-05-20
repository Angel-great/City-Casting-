"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { ORDER_TYPES, ORDER_STATUSES } from "@/lib/constants";
import { format } from "date-fns";

interface Order {
  id: string;
  orderNumber: string;
  orderType: string;
  status: string;
  createdAt: string;
  currentDept?: string | null;
  customer: {
    firstName: string;
    lastName: string;
    companyName?: string | null;
    customerCode?: string | null;
  };
  _count: { items: number };
}

interface Stats {
  totalOrders: number;
  activeOrders: number;
  totalCustomers: number;
}

export default function EmployeeDashboard() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    activeOrders: 0,
    totalCustomers: 0,
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/orders?limit=10").then((r) => r.json()),
      fetch("/api/customers").then((r) => r.json()),
    ]).then(([ordersData, customersData]) => {
      const allOrders = ordersData.orders || [];
      setOrders(allOrders);

      const active = allOrders.filter(
        (o: Order) =>
          o.status !== "DELIVERED" && o.status !== "CANCELLED"
      );

      setStats({
        totalOrders: ordersData.pagination?.total || allOrders.length,
        activeOrders: active.length,
        totalCustomers: customersData.customers?.length || 0,
      });
    });
  }, []);

  const deptOrders =
    user?.department && user.department !== "ADMIN"
      ? orders.filter((o) => o.currentDept === user.department)
      : orders;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Employee Dashboard
          </h1>
          <p className="text-gray-500">
            {user?.firstName} {user?.lastName} -{" "}
            {user?.department || user?.role}
          </p>
        </div>
        <Link href="/employee/orders/new">
          <Button size="lg">Place Order for Customer</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-amber-600">
              {stats.totalOrders}
            </p>
            <p className="text-sm text-gray-500 mt-1">Total Orders</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">
              {stats.activeOrders}
            </p>
            <p className="text-sm text-gray-500 mt-1">Active Orders</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">
              {stats.totalCustomers}
            </p>
            <p className="text-sm text-gray-500 mt-1">Customers</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">
              {user?.department || "ALL"}
            </p>
            <p className="text-sm text-gray-500 mt-1">Department</p>
          </div>
        </Card>
      </div>

      <Card
        title={
          user?.department && user.department !== "ADMIN"
            ? `${user.department} Department Orders`
            : "All Recent Orders"
        }
        subtitle="Click any order to view details and update status"
      >
        {deptOrders.length === 0 ? (
          <p className="text-gray-500 text-sm">No orders to display</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-2 text-xs font-semibold text-gray-500 uppercase">
                    Order
                  </th>
                  <th className="text-left py-2 text-xs font-semibold text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="text-left py-2 text-xs font-semibold text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="text-left py-2 text-xs font-semibold text-gray-500 uppercase">
                    Dept
                  </th>
                  <th className="text-left py-2 text-xs font-semibold text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="text-left py-2 text-xs font-semibold text-gray-500 uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {deptOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3">
                      <Link
                        href={`/employee/orders/${order.id}`}
                        className="font-medium text-amber-600 hover:text-amber-700"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3 text-sm">
                      {order.customer.companyName ||
                        `${order.customer.firstName} ${order.customer.lastName}`}
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      {ORDER_TYPES[order.orderType as keyof typeof ORDER_TYPES]}
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      {order.currentDept || "-"}
                    </td>
                    <td className="py-3">
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
                    </td>
                    <td className="py-3 text-sm text-gray-500">
                      {format(
                        new Date(order.createdAt),
                        "MMM dd, yyyy"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
