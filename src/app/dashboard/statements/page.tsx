"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/store";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { PAYMENT_TERMS } from "@/lib/constants";
import { format } from "date-fns";

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  paidAmount: number;
  status: string;
  dueDate: string;
  createdAt: string;
  order?: {
    id: string;
    orderNumber: string;
    orderType: string;
  } | null;
}

export default function StatementsPage() {
  const { user } = useAuthStore();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [totalOutstanding, setTotalOutstanding] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/invoices")
      .then((r) => r.json())
      .then((data) => {
        setInvoices(data.invoices || []);
        setTotalOutstanding(data.totalOutstanding || 0);
        setLoading(false);
      });
  }, []);

  const statusVariant = (
    status: string
  ): "success" | "warning" | "danger" | "default" | "info" => {
    const map: Record<string, "success" | "warning" | "danger" | "default" | "info"> = {
      PAID: "success",
      PARTIAL: "warning",
      PENDING: "info",
      OVERDUE: "danger",
    };
    return map[status] || "default";
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Account Statements
      </h1>
      <p className="text-gray-500 mb-8">
        View your invoices and outstanding balance
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-red-600">
              $
              {totalOutstanding.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Total Outstanding
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-amber-600">
              {PAYMENT_TERMS[
                (user?.paymentTerms as keyof typeof PAYMENT_TERMS) || "COD"
              ] || user?.paymentTerms}
            </p>
            <p className="text-sm text-gray-500 mt-1">Payment Terms</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">
              $
              {(user?.creditLimit || 0).toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </p>
            <p className="text-sm text-gray-500 mt-1">Credit Limit</p>
          </div>
        </Card>
      </div>

      {invoices.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No invoices found
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Invoice
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Order
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Amount
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Paid
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Balance
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Due Date
                </th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {inv.invoiceNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {inv.order?.orderNumber || "-"}
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-sm">
                    ${inv.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-sm text-green-600">
                    ${inv.paidAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-sm font-semibold text-red-600">
                    ${(inv.amount - inv.paidAmount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={statusVariant(inv.status)}>
                      {inv.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {format(new Date(inv.dueDate), "MMM dd, yyyy")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
