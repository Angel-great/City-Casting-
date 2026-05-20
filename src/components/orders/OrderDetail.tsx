"use client";

import { useState, useEffect, useRef } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { ORDER_TYPES, ORDER_STATUSES } from "@/lib/constants";
import { format } from "date-fns";

interface OrderItem {
  id: string;
  styleName?: string | null;
  imageUrl?: string | null;
  metal?: string | null;
  moldType?: string | null;
  quantity: number;
  waxSize?: string | null;
  polishingServices?: string | null;
  printType?: string | null;
  fileUrl?: string | null;
  fileType?: string | null;
  cadEditNotes?: string | null;
  notes?: string | null;
}

interface StatusHistory {
  id: string;
  status: string;
  department?: string | null;
  changedBy?: string | null;
  notes?: string | null;
  createdAt: string;
}

interface OrderData {
  id: string;
  orderNumber: string;
  orderType: string;
  status: string;
  currentDept?: string | null;
  notes?: string | null;
  totalAmount: number;
  createdAt: string;
  placedAt?: string | null;
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    companyName?: string | null;
    customerCode?: string | null;
    email?: string;
    phone?: string | null;
  };
  manager?: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
  items: OrderItem[];
  statusHistory: StatusHistory[];
}

interface OrderDetailProps {
  orderId: string;
  isEmployee?: boolean;
}

const statusBadgeVariant = (
  status: string
): "default" | "success" | "warning" | "danger" | "info" => {
  const map: Record<string, "default" | "success" | "warning" | "danger" | "info"> = {
    CREATED: "default",
    PLACED: "info",
    IN_PROGRESS: "warning",
    CASTING: "warning",
    WAX: "warning",
    MOLD_MAKING: "warning",
    POLISHING: "warning",
    CAD: "warning",
    QUALITY_CHECK: "info",
    READY: "success",
    DELIVERED: "success",
    CANCELLED: "danger",
  };
  return map[status] || "default";
};

export default function OrderDetail({
  orderId,
  isEmployee = false,
}: OrderDetailProps) {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/orders/${orderId}`)
      .then((r) => r.json())
      .then((data) => {
        setOrder(data.order);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [orderId]);

  const handleStatusUpdate = async (newStatus: string, dept?: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          department: dept,
          notes: `Status updated to ${newStatus}`,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
      }
    } finally {
      setUpdating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return <div className="text-center py-12 text-gray-500">Order not found</div>;
  }

  const polishingParsed = (services: string | null | undefined): string[] => {
    if (!services) return [];
    try {
      return JSON.parse(services);
    } catch {
      return services.split(",").map((s) => s.trim());
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Order {order.orderNumber}
          </h1>
          <p className="text-gray-500">
            {ORDER_TYPES[order.orderType as keyof typeof ORDER_TYPES]}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handlePrint}>
            Print Order Sheet
          </Button>
          {isEmployee && order.status === "CREATED" && (
            <Button
              onClick={() => handleStatusUpdate("PLACED")}
              disabled={updating}
            >
              Place Order
            </Button>
          )}
          {isEmployee && order.status === "PLACED" && (
            <Button
              onClick={() => handleStatusUpdate("IN_PROGRESS")}
              disabled={updating}
            >
              Start Processing
            </Button>
          )}
          {isEmployee && order.status === "IN_PROGRESS" && (
            <Button
              onClick={() => handleStatusUpdate("READY")}
              disabled={updating}
            >
              Mark Ready
            </Button>
          )}
          {isEmployee && order.status === "READY" && (
            <Button
              onClick={() => handleStatusUpdate("DELIVERED")}
              disabled={updating}
            >
              Mark Delivered
            </Button>
          )}
        </div>
      </div>

      {/* Printable Order Sheet */}
      <div
        ref={printRef}
        className="bg-white rounded-xl border border-gray-200 print:border-0 print:shadow-none"
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        {/* Order Sheet Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-amber-700">
                City Casting Corp
              </h2>
              <p className="text-sm text-gray-500">
                Premium Metal Casting Services
              </p>
              <p className="text-xs text-gray-400 mt-1">
                New York, NY | (555) 123-4567
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900">
                {order.customer.companyName ||
                  `${order.customer.firstName} ${order.customer.lastName}`}
              </h3>
              <p className="text-sm text-gray-500">
                {order.customer.customerCode}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                {format(new Date(order.createdAt), "MMM dd, yyyy")}
              </p>
              <p className="text-lg font-bold font-mono mt-1">
                {order.orderNumber}
              </p>
              <Badge variant={statusBadgeVariant(order.status)}>
                {ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES] || order.status}
              </Badge>
              {order.manager && (
                <p className="text-xs text-gray-500 mt-1">
                  Assisted by: {order.manager.firstName}{" "}
                  {order.manager.lastName}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Order Type Header */}
        <div className="px-6 py-3 bg-amber-50 border-b border-amber-200">
          <span className="font-semibold text-amber-800">
            {ORDER_TYPES[order.orderType as keyof typeof ORDER_TYPES]}
          </span>
          <span className="text-amber-600 ml-2">
            | {order.items.length} item(s)
          </span>
        </div>

        {/* Order Items Table */}
        <div className="p-6">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-2 text-sm font-semibold text-gray-700 w-24">
                  Image
                </th>
                {order.orderType === "MOLD_CAST" && (
                  <th className="text-left py-2 text-sm font-semibold text-gray-700">
                    Style
                  </th>
                )}
                {(order.orderType === "MAKE_MOLD" || order.orderType === "MOLD_CAST") && (
                  <th className="text-left py-2 text-sm font-semibold text-gray-700">
                    Mold
                  </th>
                )}
                <th className="text-left py-2 text-sm font-semibold text-gray-700">
                  Cast / Metal
                </th>
                {(order.orderType === "MAKE_MOLD" || order.orderType === "MOLD_CAST" || order.orderType === "FILE_CAST") && (
                  <th className="text-left py-2 text-sm font-semibold text-gray-700">
                    Qty
                  </th>
                )}
                <th className="text-left py-2 text-sm font-semibold text-gray-700">
                  Size
                </th>
                <th className="text-left py-2 text-sm font-semibold text-gray-700">
                  Polishing
                </th>
                <th className="text-left py-2 text-sm font-semibold text-gray-700">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => (
                <tr
                  key={item.id}
                  className={
                    idx < order.items.length - 1
                      ? "border-b border-gray-200"
                      : ""
                  }
                >
                  <td className="py-3">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt="Item"
                        className="w-20 h-20 object-cover rounded"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                  </td>
                  {order.orderType === "MOLD_CAST" && (
                    <td className="py-3 text-sm">
                      {item.styleName || "-"}
                    </td>
                  )}
                  {(order.orderType === "MAKE_MOLD" || order.orderType === "MOLD_CAST") && (
                    <td className="py-3 text-sm">
                      {item.moldType || "-"}
                    </td>
                  )}
                  <td className="py-3 text-sm font-medium">
                    {item.metal || "-"}
                  </td>
                  {(order.orderType === "MAKE_MOLD" || order.orderType === "MOLD_CAST" || order.orderType === "FILE_CAST") && (
                    <td className="py-3 text-sm">{item.quantity}</td>
                  )}
                  <td className="py-3 text-sm">
                    {item.waxSize || "-"}
                  </td>
                  <td className="py-3 text-sm">
                    {polishingParsed(item.polishingServices).length > 0
                      ? polishingParsed(item.polishingServices).join(", ")
                      : "-"}
                  </td>
                  <td className="py-3 text-sm text-gray-600">
                    {item.notes || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {order.notes && (
          <div className="px-6 pb-6">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm font-semibold text-gray-700 mb-1">
                Order Notes:
              </p>
              <p className="text-sm text-gray-600">{order.notes}</p>
            </div>
          </div>
        )}

        {/* Footer with copy type */}
        <div className="px-6 py-3 border-t border-gray-200 flex justify-between text-xs text-gray-400">
          <span>Vendor Copy</span>
          <span>City Casting Corp - {order.orderNumber}</span>
        </div>
      </div>

      {/* Status Timeline (not printed) */}
      <div className="mt-8 print:hidden">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Order Progress
        </h3>
        <div className="space-y-4">
          {order.statusHistory.map((entry) => (
            <div
              key={entry.id}
              className="flex items-start gap-4"
            >
              <div className="w-3 h-3 bg-amber-500 rounded-full mt-1.5 shrink-0" />
              <div>
                <p className="font-medium text-gray-900">
                  {ORDER_STATUSES[entry.status as keyof typeof ORDER_STATUSES] || entry.status}
                </p>
                {entry.department && (
                  <p className="text-sm text-gray-500">
                    Department: {entry.department}
                  </p>
                )}
                {entry.notes && (
                  <p className="text-sm text-gray-500">{entry.notes}</p>
                )}
                <p className="text-xs text-gray-400">
                  {format(new Date(entry.createdAt), "MMM dd, yyyy HH:mm")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Department Actions (Employee only) */}
      {isEmployee && (
        <div className="mt-8 print:hidden">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Department Actions
          </h3>
          <div className="flex flex-wrap gap-2">
            {["CASTING", "WAX", "MOLD_MAKING", "POLISHING", "CAD"].map(
              (dept) => (
                <Button
                  key={dept}
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusUpdate(dept, dept)}
                  disabled={updating || order.status === "DELIVERED" || order.status === "CANCELLED"}
                >
                  Send to {dept.replace("_", " ")}
                </Button>
              )
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusUpdate("QUALITY_CHECK")}
              disabled={updating}
            >
              Quality Check
            </Button>
          </div>
        </div>
      )}

      {/* Quick Info */}
      <div className="mt-8 print:hidden grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h4 className="text-sm font-semibold text-gray-500 mb-2">
            Customer
          </h4>
          <p className="font-medium">
            {order.customer.firstName} {order.customer.lastName}
          </p>
          <p className="text-sm text-gray-500">
            {order.customer.companyName}
          </p>
          <p className="text-xs text-gray-400">
            {order.customer.customerCode}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h4 className="text-sm font-semibold text-gray-500 mb-2">
            Order Info
          </h4>
          <p className="font-medium">{order.orderNumber}</p>
          <p className="text-sm text-gray-500">
            Created: {format(new Date(order.createdAt), "MMM dd, yyyy")}
          </p>
          {order.placedAt && (
            <p className="text-sm text-gray-500">
              Placed:{" "}
              {format(new Date(order.placedAt), "MMM dd, yyyy")}
            </p>
          )}
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h4 className="text-sm font-semibold text-gray-500 mb-2">
            Current Status
          </h4>
          <Badge variant={statusBadgeVariant(order.status)}>
            {ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES] || order.status}
          </Badge>
          {order.currentDept && (
            <p className="text-sm text-gray-500 mt-2">
              Department: {order.currentDept}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
