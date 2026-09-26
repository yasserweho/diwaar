import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import type { ForumPost, Reply, SavedAlert, WantedAd } from "./portal";
import type { Property } from "./types";

export interface LoanApp {
  id: string;
  bank: string;
  product: string;
  amount: number;
  years: number;
  propertyTitle: string;
  stage: "submitted" | "valuation" | "approved" | "disbursed";
  createdAt: string;
}

export interface Order {
  id: string;
  kind: string;
  title: string;
  amount: number;
  method: string;
  reference: string;
  status: "paid";
  createdAt: string;
}

export interface Desk {
  savedIds: string[];
  listings: Property[];
  alerts: SavedAlert[];
  wanted: WantedAd[];
  threads: ForumPost[];
  replies: Record<string, Reply[]>;
  orders: Order[];
  loans: LoanApp[];
  compareIds: string[];
  reserved: string[];
  reported: string[];
}

const STAGES: LoanApp["stage"][] = ["submitted", "valuation", "approved", "disbursed"];

function asDesk(partial: Partial<Desk>): Desk {
  return {
    savedIds: partial.savedIds ?? [],
    listings: partial.listings ?? [],
    alerts: partial.alerts ?? [],
    wanted: partial.wanted ?? [],
    threads: partial.threads ?? [],
    replies: partial.replies ?? {},
    orders: partial.orders ?? [],
    loans: partial.loans ?? [],
    compareIds: partial.compareIds ?? [],
    reserved: partial.reserved ?? [],
    reported: partial.reported ?? [],
  };
}

export const loadDesk = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<Desk> => {
    const sql = await getSql();
    const uid = context.userId;
    const saved = await sql<{ property_id: string }>`select property_id from diwaar_saved where user_id = ${uid}`;
    const listings = await sql<{ payload: string }>`select payload from diwaar_listings where user_id = ${uid}`;
    const alerts = await sql<{ id: string; label: string; params: string; created_at: string }>`select id, label, params, created_at from diwaar_alerts where user_id = ${uid}`;
    const wanted = await sql<{ id: string; name: string; city: string; type: string; budget: string; note: string; created_at: string }>`select id, name, city, type, budget, note, created_at from diwaar_wanted where user_id = ${uid}`;
    const threads = await sql<{ id: string; title: string; body: string; author: string; city: string; topic: string; created_at: string }>`select id, title, body, author, city, topic, created_at from diwaar_threads where user_id = ${uid}`;
    const replies = await sql<{ thread_id: string; author: string; body: string }>`select thread_id, author, body from diwaar_replies where user_id = ${uid}`;
    const orders = await sql<{ id: string; kind: string; title: string; amount: number; method: string; reference: string; status: string; created_at: string }>`select id, kind, title, amount, method, reference, status, created_at from diwaar_orders where user_id = ${uid}`;
    const loans = await sql<{ id: string; bank: string; product: string; amount: number; years: number; property_title: string; stage: string; created_at: string }>`select id, bank, product, amount, years, property_title, stage, created_at from diwaar_loans where user_id = ${uid}`;
    const flags = await sql<{ kind: string; ref_id: string }>`select kind, ref_id from diwaar_flags where user_id = ${uid}`;
    const replyMap: Record<string, Reply[]> = {};
    for (const r of replies) {
      (replyMap[r.thread_id] ??= []).push({ author: r.author, body: r.body });
    }
    const stage = (s: string): LoanApp["stage"] =>
      STAGES.includes(s as LoanApp["stage"]) ? (s as LoanApp["stage"]) : "submitted";
    return {
      savedIds: saved.map((r) => r.property_id),
      listings: listings.map((r) => JSON.parse(r.payload) as Property),
      alerts: alerts.map((r) => ({ id: r.id, label: r.label, params: JSON.parse(r.params), createdAt: r.created_at })),
      wanted: wanted.map((r) => ({
        id: r.id,
        name: r.name,
        city: r.city,
        type: r.type,
        budget: r.budget,
        note: r.note,
        createdAt: r.created_at,
      })),
      threads: threads.map((r) => ({
        id: r.id,
        title: r.title,
        body: r.body,
        author: r.author,
        city: r.city,
        topic: r.topic,
        createdAt: r.created_at,
        replies: [],
      })),
      replies: replyMap,
      orders: orders.map((r) => ({
        id: r.id,
        kind: r.kind,
        title: r.title,
        amount: Number(r.amount),
        method: r.method,
        reference: r.reference,
        status: "paid",
        createdAt: r.created_at,
      })),
      loans: loans.map((r) => ({
        id: r.id,
        bank: r.bank,
        product: r.product,
        amount: Number(r.amount),
        years: Number(r.years),
        propertyTitle: r.property_title,
        stage: stage(r.stage),
        createdAt: r.created_at,
      })),
      compareIds: flags.filter((f) => f.kind === "compare").map((f) => f.ref_id),
      reserved: flags.filter((f) => f.kind === "reserved").map((f) => f.ref_id),
      reported: flags.filter((f) => f.kind === "reported").map((f) => f.ref_id),
    };
  });

export const saveDesk = createServerFn({ method: "POST" })
  .validator((input: Desk) => asDesk(input))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const uid = context.userId;
    await sql`delete from diwaar_saved where user_id = ${uid}`;
    await sql`delete from diwaar_listings where user_id = ${uid}`;
    await sql`delete from diwaar_alerts where user_id = ${uid}`;
    await sql`delete from diwaar_wanted where user_id = ${uid}`;
    await sql`delete from diwaar_threads where user_id = ${uid}`;
    await sql`delete from diwaar_replies where user_id = ${uid}`;
    await sql`delete from diwaar_orders where user_id = ${uid}`;
    await sql`delete from diwaar_loans where user_id = ${uid}`;
    await sql`delete from diwaar_flags where user_id = ${uid}`;
    for (const id of data.savedIds.slice(0, 200)) {
      await sql`insert into diwaar_saved (user_id, property_id) values (${uid}, ${id})`;
    }
    for (const p of data.listings.slice(0, 50)) {
      await sql`insert into diwaar_listings (user_id, id, payload) values (${uid}, ${p.id}, ${JSON.stringify(p)})`;
    }
    for (const a of data.alerts.slice(0, 30)) {
      await sql`insert into diwaar_alerts (user_id, id, label, params, created_at) values (${uid}, ${a.id}, ${a.label}, ${JSON.stringify(a.params)}, ${a.createdAt})`;
    }
    for (const w of data.wanted.slice(0, 30)) {
      await sql`insert into diwaar_wanted (user_id, id, name, city, type, budget, note, created_at) values (${uid}, ${w.id}, ${w.name}, ${w.city}, ${w.type}, ${w.budget}, ${w.note}, ${w.createdAt})`;
    }
    for (const t of data.threads.slice(0, 30)) {
      await sql`insert into diwaar_threads (user_id, id, title, body, author, city, topic, created_at) values (${uid}, ${t.id}, ${t.title}, ${t.body}, ${t.author}, ${t.city}, ${t.topic}, ${t.createdAt})`;
    }
    for (const [threadId, list] of Object.entries(data.replies)) {
      for (const r of list.slice(0, 20)) {
        await sql`insert into diwaar_replies (user_id, thread_id, author, body) values (${uid}, ${threadId}, ${r.author}, ${r.body})`;
      }
    }
    for (const o of data.orders.slice(0, 40)) {
      await sql`insert into diwaar_orders (user_id, id, kind, title, amount, method, reference, status, created_at) values (${uid}, ${o.id}, ${o.kind}, ${o.title}, ${Math.round(o.amount)}, ${o.method}, ${o.reference}, ${"paid"}, ${o.createdAt})`;
    }
    for (const l of data.loans.slice(0, 20)) {
      const stage = STAGES.includes(l.stage) ? l.stage : "submitted";
      await sql`insert into diwaar_loans (user_id, id, bank, product, amount, years, property_title, stage, created_at) values (${uid}, ${l.id}, ${l.bank}, ${l.product}, ${Math.round(l.amount)}, ${Math.round(l.years)}, ${l.propertyTitle}, ${stage}, ${l.createdAt})`;
    }
    for (const id of data.compareIds.slice(0, 3)) {
      await sql`insert into diwaar_flags (user_id, kind, ref_id) values (${uid}, ${"compare"}, ${id})`;
    }
    for (const id of data.reserved.slice(0, 20)) {
      await sql`insert into diwaar_flags (user_id, kind, ref_id) values (${uid}, ${"reserved"}, ${id})`;
    }
    for (const id of data.reported.slice(0, 50)) {
      await sql`insert into diwaar_flags (user_id, kind, ref_id) values (${uid}, ${"reported"}, ${id})`;
    }
    return { ok: true };
  });
