import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";

const TOPICS = ["listing", "search", "account", "other"] as const;

export type ContactTopic = (typeof TOPICS)[number];

export type ContactInput = {
  name: string;
  email: string;
  phone: string;
  topic: ContactTopic;
  message: string;
};

function clean(value: unknown, max: number) {
  return String(value ?? "")
    .replace(/[\u0000-\u001f]/g, " ")
    .trim()
    .slice(0, max);
}

function asContact(input: ContactInput): ContactInput {
  const name = clean(input?.name, 80);
  const email = clean(input?.email, 120).toLowerCase();
  const phone = clean(input?.phone, 30);
  const topic = TOPICS.includes(input?.topic) ? input.topic : "other";
  const message = clean(input?.message, 2000);
  if (name.length < 2) throw new Error("Enter your name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email.");
  if (message.length < 10) throw new Error("Write a message of at least 10 characters.");
  return { name, email, phone, topic, message };
}

export const sendContact = createServerFn({ method: "POST" })
  .validator((input: ContactInput) => asContact(input))
  .handler(async ({ data }) => {
    const sql = await getSql();
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    await sql`insert into diwaar_contact (id, name, email, phone, topic, message, created_at)
      values (${id}, ${data.name}, ${data.email}, ${data.phone}, ${data.topic}, ${data.message}, ${createdAt})`;
    return { ok: true as const };
  });
