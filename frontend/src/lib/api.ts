import type { CreateExpensePayload, Expense } from "@/types";
const BASE = import.meta.env.VITE_API_URL ?? "/api";

export async function getExpenses(params?: {
  category?: string;
}): Promise<Expense[]> {
  const url = new URL(`${BASE}/expenses`);
  if (params?.category) url.searchParams.set("category", params.category);
  url.searchParams.set("sort", "date_desc");
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch expenses");
  return res.json();
}

export async function createExpense(
  payload: CreateExpensePayload,
): Promise<Expense> {
  const res = await fetch(`${BASE}/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error ?? "Failed to create expense");
  }
  return res.json();
}

export async function getCategories(): Promise<string[]> {
  const res = await fetch(`${BASE}/expenses/categories`);
  if (!res.ok) return [];
  return res.json();
}
