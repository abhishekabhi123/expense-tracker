import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { Prisma } from "@prisma/client";

const router = Router();

const createExpenseScheme = z.object({
  amount: z
    .number()
    .positive("Amount must be positive")
    .multipleOf(0.01, "Max 2 decimal places"),
  category: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format"),
  idempotencyKey: z.string().uuid("Must be a valid UUID"),
});

router.post("/", async (req: Request, res: Response) => {
  const result = createExpenseScheme.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: result.error.flatten().fieldErrors,
    });
  }

  const { amount, category, description, date, idempotencyKey } = result.data;

  try {
    const expense = await prisma.expense.create({
      data: {
        amount: new Prisma.Decimal(amount),
        category: category.trim(),
        description: description.trim(),
        date: new Date(`${date}T00:00:00.000Z`),
        idempotencyKey,
      },
    });
    return res.status(201).json(serialize(expense));
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const existing = await prisma.expense.findUnique({
        where: { idempotencyKey },
      });
      return res.status(200).json(serialize(existing!));
    }
    console.error("POST /expenses:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req: Request, res: Response) => {
  const { category } = req.query;

  const where: Prisma.ExpenseWhereInput = {};
  if (typeof category === "string" && category.trim()) {
    where.category = { equals: category.trim(), mode: "insensitive" };
  }
  try {
    const expenses = await prisma.expense.findMany({
      where,
      orderBy: { date: "desc" },
    });
    return res.json(expenses.map(serialize));
  } catch (err) {
    console.error("GET /expenses:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/categories", async (_req: Request, res: Response) => {
  try {
    const rows = await prisma.expense.findMany({
      distinct: ["category"],
      select: { category: true },
      orderBy: { category: "asc" },
    });
    return res.json(rows.map((r) => r.category));
  } catch (error) {
    console.error("GET /expenses/categories:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

type ExpenseRow = Awaited<ReturnType<typeof prisma.expense.findUniqueOrThrow>>;

function serialize(e: ExpenseRow) {
  return {
    id: e.id,
    amount: e.amount.toFixed(2),
    category: e.category,
    description: e.description,
    date: e.date.toISOString().split("T")[0],
    idempotencyKey: e.idempotencyKey,
    createdAt: e.createdAt.toISOString(),
  };
}

export default router;
