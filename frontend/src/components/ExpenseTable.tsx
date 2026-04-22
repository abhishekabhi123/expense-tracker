import type { Expense } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Receipt } from "lucide-react";

const CATEGORY_COLORS: Record<string, string> = {
  Food: "bg-orange-50 text-orange-700",
  Transport: "bg-blue-50 text-blue-700",
  Shopping: "bg-purple-50 text-purple-700",
  Entertainment: "bg-pink-50 text-pink-700",
  Health: "bg-green-50 text-green-700",
  Utilities: "bg-yellow-50 text-yellow-700",
  Other: "bg-gray-100 text-gray-600",
};

interface Props {
  expenses: Expense[];
  loading: boolean;
}

export function ExpenseTable({ expenses, loading }: Props) {
  // Skeleton loader
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-[#dcd9d5] overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex gap-4 p-4 border-b border-[#f3f0ec] last:border-0"
          >
            <div className="h-4 w-24 bg-[#f3f0ec] rounded animate-pulse" />
            <div className="h-4 w-16 bg-[#f3f0ec] rounded animate-pulse" />
            <div className="h-4 flex-1 bg-[#f3f0ec] rounded animate-pulse" />
            <div className="h-4 w-20 bg-[#f3f0ec] rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#dcd9d5] p-16 flex flex-col items-center text-center">
        <Receipt size={40} className="text-[#bab9b4] mb-3" />
        <h3 className="font-semibold text-[#28251d] mb-1">No expenses yet</h3>
        <p className="text-sm text-[#7a7974]">
          Click "Add Expense" to record your first one.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#dcd9d5] overflow-hidden shadow-sm">
      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#f7f6f2] border-b border-[#dcd9d5]">
            <tr>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#7a7974] font-medium">
                Date
              </th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#7a7974] font-medium">
                Category
              </th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#7a7974] font-medium">
                Description
              </th>
              <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-[#7a7974] font-medium">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f3f0ec]">
            {expenses.map((e) => (
              <tr key={e.id} className="hover:bg-[#f9f8f5] transition-colors">
                <td className="px-4 py-3 text-[#7a7974] tabular whitespace-nowrap">
                  {formatDate(e.date)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      CATEGORY_COLORS[e.category] ?? "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {e.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#28251d] max-w-xs truncate">
                  {e.description}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-[#01696f] tabular whitespace-nowrap">
                  {formatCurrency(e.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="sm:hidden divide-y divide-[#f3f0ec]">
        {expenses.map((e) => (
          <div
            key={e.id}
            className="p-4 flex justify-between items-start gap-3"
          >
            <div className="space-y-1 min-w-0">
              <p className="font-medium text-[#28251d] truncate">
                {e.description}
              </p>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    CATEGORY_COLORS[e.category] ?? "bg-gray-100 text-gray-600"
                  }`}
                >
                  {e.category}
                </span>
                <span className="text-xs text-[#7a7974]">
                  {formatDate(e.date)}
                </span>
              </div>
            </div>
            <span className="font-bold text-[#01696f] tabular whitespace-nowrap">
              {formatCurrency(e.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
