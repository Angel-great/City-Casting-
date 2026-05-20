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
  _count: { items: number };
}

interface MetalPrice {
  id: string;
  metalType: string;
  karat?: string | null;
  pricePerOz: number;
  pricePerGram: number;
}

export default function CustomerDashboard() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [prices, setPrices] = useState<MetalPrice[]>([]);
  const [outstanding, setOutstanding] = useState(0);
  const [moldCount, setMoldCount] = useState(0);

  useEffect(() => {
    Promise.all([
      fetch("/api/orders?limit=5").then((r) => r.json()),
      fetch("/api/metals").then((r) => r.json()),
      fetch("/api/invoices").then((r) => r.json()),
      fetch("/api/molds").then((r) => r.json()),
    ]).then(([ordersData, metalsData, invoicesData, moldsData]) => {
      setOrders(ordersData.orders || []);
      setPrices(metalsData.prices || []);
      setOutstanding(invoicesData.totalOutstanding || 0);
      setMoldCount(moldsData.molds?.length || 0);
    });
  }, []);

  const activeOrders = orders.filter(
    (o) => o.status !== "DELIVERED" && o.status !== "CANCELLED"
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back,{" "}
            {user?.companyName || `${user?.firstName} ${user?.lastName}`}
          </h1>
          <p className="text-gray-500">
            Customer Code: {user?.customerCode}
          </p>
        </div>
        <Link href="/dashboard/orders/new">
          <Button size="lg">Place New Order</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-amber-600">
              {activeOrders.length}
            </p>
            <p className="text-sm text-gray-500 mt-1">Active Orders</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{moldCount}</p>
            <p className="text-sm text-gray-500 mt-1">Molds in Inventory</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-red-600">
              ${outstanding.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-gray-500 mt-1">Outstanding Balance</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">
              {user?.paymentTerms || "COD"}
            </p>
            <p className="text-sm text-gray-500 mt-1">Payment Terms</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <Card title="Recent Orders" subtitle="Your latest orders">
          {orders.length === 0 ? (
            <p className="text-gray-500 text-sm">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/dashboard/orders/${order.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {order.orderNumber}
                    </p>
                    <p className="text-sm text-gray-500">
                      {ORDER_TYPES[order.orderType as keyof typeof ORDER_TYPES]} -{" "}
                      {order._count.items} item(s)
                    </p>
                    <p className="text-xs text-gray-400">
                      {format(new Date(order.createdAt), "MMM dd, yyyy")}
                    </p>
                  </div>
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
                </Link>
              ))}
            </div>
          )}
          <Link
            href="/dashboard/orders"
            className="block text-center text-sm text-amber-600 hover:text-amber-700 mt-4"
          >
            View All Orders
          </Link>
        </Card>

        {/* Metal Prices */}
        <Card title="Precious Metal Prices" subtitle="Current market rates">
          <div className="space-y-2">
            {prices
              .filter((p) =>
                ["GOLD", "SILVER", "PLATINUM", "PALLADIUM"].includes(
                  p.metalType
                )
              )
              .slice(0, 6)
              .map((price) => (
                <div
                  key={price.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <span className="font-medium text-gray-900">
                      {price.metalType}
                    </span>
                    {price.karat && (
                      <span className="text-sm text-gray-500 ml-1">
                        ({price.karat})
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${price.pricePerOz.toFixed(2)}/oz
                    </p>
                    <p className="text-xs text-gray-500">
                      ${price.pricePerGram.toFixed(2)}/g
                    </p>
                  </div>
                </div>
              ))}
          </div>
          <Link
            href="/dashboard/pricing"
            className="block text-center text-sm text-amber-600 hover:text-amber-700 mt-4"
          >
            View Full Pricing
          </Link>
        </Card>
      </div>
    </div>
  );
}
