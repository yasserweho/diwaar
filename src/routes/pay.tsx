import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatPkr } from "@/lib/format";
import { useAppStore } from "@/lib/store";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

function parse(s: Record<string, unknown>) {
  const amount = Number(s.amount);
  return {
    kind: typeof s.kind === "string" ? s.kind : "listing",
    title: typeof s.title === "string" ? s.title : "Diwaar payment",
    amount: Number.isFinite(amount) && amount > 0 ? Math.round(amount) : 5000,
  };
}

export const Route = createFileRoute("/pay")({
  validateSearch: parse,
  component: PayPage,
});

const METHODS = ["Bank transfer", "JazzCash", "EasyPaisa"] as const;

function PayPage() {
  const { kind, title, amount } = Route.useSearch();
  const { user, isPending } = useCurrentUserState();
  const currency = useAppStore((s) => s.currency);
  const addOrder = useAppStore((s) => s.addOrder);
  const navigate = useNavigate();
  const [method, setMethod] = useState<(typeof METHODS)[number]>("Bank transfer");
  const [account, setAccount] = useState("");

  if (!isPending && !user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="font-bold">Sign in to pay</p>
        <Link to="/login" className="mt-3 inline-flex text-sm font-semibold text-primary">
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Checkout</p>
      <h1 className="mt-1 text-3xl font-extrabold text-primary-dark">{title}</h1>
      <p className="mt-2 text-2xl font-extrabold tabular-nums">{formatPkr(amount, currency)}</p>
      <p className="mt-2 text-sm text-muted">
        Payment is recorded on your Diwaar account and a receipt is issued. This preview does not charge a card network.
      </p>
      <form
        className="mt-6 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (account.trim().length < 6) {
            toast.error("Enter the account or mobile number to pay from");
            return;
          }
          const reference = `DW-${Date.now().toString().slice(-8)}`;
          addOrder({
            id: reference,
            kind,
            title,
            amount,
            method,
            reference,
            status: "paid",
            createdAt: new Date().toISOString().slice(0, 10),
          });
          toast.success(`Paid. Receipt ${reference}`);
          void navigate({ to: "/orders" });
        }}
      >
        <div className="grid gap-2">
          {METHODS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMethod(m)}
              className={`h-11 rounded-lg text-sm font-semibold ${method === m ? "bg-primary text-primary-fg" : "bg-ice text-fg"}`}
            >
              {m}
            </button>
          ))}
        </div>
        <input
          className="h-12 w-full rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-primary"
          placeholder={method === "Bank transfer" ? "IBAN or account number" : "Mobile account"}
          value={account}
          onChange={(e) => setAccount(e.target.value)}
        />
        <Button type="submit" className="w-full">
          Pay {formatPkr(amount, currency)}
        </Button>
      </form>
    </div>
  );
}
