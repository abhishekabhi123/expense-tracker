import { useState, useEffect, useCallback } from "react";
import { PlusCircle, RefreshCw } from "lucide-react";
import type { Expense } from "@/types";
import { getExpenses, getCategories } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpenseTable } from "@/components/ExpenseTable";

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [exp, cats] = await Promise.all([
        getExpenses({ category: selectedCategory || undefined }),
        getCategories(),
      ]);
      setExpenses(exp);
      setCategories(cats);
    } catch {
      setError("Failed to load expenses. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  return (
    <div className="min-h-screen bg-[#f7f6f2]">
      {/* Header */}
      <header className="border-b border-[#dcd9d5] bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="text-[#01696f]"
            >
              <rect
                x="2"
                y="5"
                width="20"
                height="14"
                rx="3"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path d="M2 10h20" stroke="currentColor" strokeWidth="2" />
              <circle cx="7" cy="15" r="1.5" fill="currentColor" />
            </svg>
            <span className="font-bold text-[#28251d] tracking-tight">
              ExpenseTracker
            </span>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-[#01696f] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#0c4e54] transition-colors"
          >
            <PlusCircle size={16} />
            Add Expense
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Stats + Filter Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {/* Total */}
          <div className="bg-white rounded-xl border border-[#dcd9d5] p-4 shadow-sm">
            <p className="text-xs text-[#7a7974] uppercase tracking-wide">
              Total Shown
            </p>
            <p className="text-2xl font-bold text-[#01696f] tabular mt-1">
              {formatCurrency(total)}
            </p>
          </div>

          {/* Count */}
          <div className="bg-white rounded-xl border border-[#dcd9d5] p-4 shadow-sm">
            <p className="text-xs text-[#7a7974] uppercase tracking-wide">
              Entries
            </p>
            <p className="text-2xl font-bold text-[#28251d] tabular mt-1">
              {expenses.length}
            </p>
          </div>

          {/* Category Filter */}
          <div className="bg-white rounded-xl border border-[#dcd9d5] p-4 shadow-sm col-span-2 sm:col-span-1">
            <p className="text-xs text-[#7a7974] uppercase tracking-wide mb-1">
              Filter by Category
            </p>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-sm bg-transparent border-0 p-0 font-medium text-[#28251d] focus:ring-0 cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={fetchData}
              className="flex items-center gap-1 font-medium hover:underline ml-4 shrink-0"
            >
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        )}

        {/* Expense Table */}
        <ExpenseTable expenses={expenses} loading={loading} />
      </main>

      {/* Add Expense Modal */}
      {showForm && (
        <ExpenseForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
}

export default App;
