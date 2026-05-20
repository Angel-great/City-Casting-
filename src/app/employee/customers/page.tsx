"use client";

import { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import { useAuthStore } from "@/lib/store";
import { PAYMENT_TERMS } from "@/lib/constants";

interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName?: string | null;
  phone?: string | null;
  customerCode?: string | null;
  paymentTerms: string;
  creditLimit: number;
  isActive: boolean;
  createdAt: string;
  _count: {
    orders: number;
    molds: number;
  };
}

export default function CustomersPage() {
  const { user } = useAuthStore();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [editForm, setEditForm] = useState({
    paymentTerms: "",
    creditLimit: 0,
  });

  const canEdit =
    user?.role === "ACCOUNT_MANAGER" || user?.role === "EXECUTIVE";

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);

    fetch(`/api/customers?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setCustomers(data.customers || []);
        setLoading(false);
      });
  }, [search]);

  const handleEdit = (customer: Customer) => {
    setEditCustomer(customer);
    setEditForm({
      paymentTerms: customer.paymentTerms,
      creditLimit: customer.creditLimit,
    });
  };

  const handleSave = async () => {
    if (!editCustomer) return;

    const res = await fetch(`/api/customers/${editCustomer.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });

    if (res.ok) {
      const data = await res.json();
      setCustomers(
        customers.map((c) =>
          c.id === editCustomer.id ? { ...c, ...data.customer } : c
        )
      );
      setEditCustomer(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Customers</h1>

      <div className="mb-6">
        <Input
          placeholder="Search customers by name, company, code, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Customer
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Code
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Contact
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Terms
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Credit
                </th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Orders
                </th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Molds
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Status
                </th>
                {canEdit && (
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">
                      {customer.companyName ||
                        `${customer.firstName} ${customer.lastName}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {customer.firstName} {customer.lastName}
                    </p>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-amber-700">
                    {customer.customerCode}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <p>{customer.email}</p>
                    <p className="text-gray-500">{customer.phone}</p>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {PAYMENT_TERMS[
                      customer.paymentTerms as keyof typeof PAYMENT_TERMS
                    ] || customer.paymentTerms}
                  </td>
                  <td className="px-6 py-4 text-sm text-right font-mono">
                    ${customer.creditLimit.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-center">
                    {customer._count.orders}
                  </td>
                  <td className="px-6 py-4 text-sm text-center">
                    {customer._count.molds}
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={customer.isActive ? "success" : "danger"}
                    >
                      {customer.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  {canEdit && (
                    <td className="px-6 py-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(customer)}
                      >
                        Edit
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={!!editCustomer}
        onClose={() => setEditCustomer(null)}
        title={`Edit Customer - ${editCustomer?.companyName || `${editCustomer?.firstName} ${editCustomer?.lastName}`}`}
      >
        <div className="space-y-4">
          <Select
            label="Payment Terms"
            value={editForm.paymentTerms}
            onChange={(e) =>
              setEditForm({ ...editForm, paymentTerms: e.target.value })
            }
            options={Object.entries(PAYMENT_TERMS).map(([key, label]) => ({
              value: key,
              label,
            }))}
          />
          <Input
            label="Credit Limit ($)"
            type="number"
            value={editForm.creditLimit}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                creditLimit: parseFloat(e.target.value) || 0,
              })
            }
          />
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setEditCustomer(null)}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
