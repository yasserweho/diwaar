import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";

export type PublicReview = {
  id: string;
  name: string;
  city: string;
  rating: number;
  body: string;
  createdAt: string;
};

export type ReviewInput = {
  name: string;
  city: string;
  rating: number;
  body: string;
};

function clean(value: unknown, max: number) {
  return String(value ?? "")
    .replace(/[\u0000-\u001f]/g, " ")
    .trim()
    .slice(0, max);
}

function asReview(input: ReviewInput): ReviewInput {
  const name = clean(input?.name, 60);
  const city = clean(input?.city, 40);
  const rating = Math.round(Number(input?.rating));
  const body = clean(input?.body, 600);
  if (name.length < 2) throw new Error("Enter your name.");
  if (rating < 1 || rating > 5) throw new Error("Choose a rating from 1 to 5.");
  if (body.length < 20) throw new Error("Write at least 20 characters.");
  return { name, city, rating, body };
}

export const listReviews = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql<{
    id: string;
    name: string;
    city: string;
    rating: number;
    body: string;
    created_at: string;
  }>`select id, name, city, rating, body, created_at from diwaar_reviews order by created_at desc limit 24`;
  return rows.map(
    (row): PublicReview => ({
      id: row.id,
      name: row.name,
      city: row.city,
      rating: Number(row.rating),
      body: row.body,
      createdAt: row.created_at,
    }),
  );
});

export const sendReview = createServerFn({ method: "POST" })
  .validator((input: ReviewInput) => asReview(input))
  .handler(async ({ data }) => {
    const sql = await getSql();
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    await sql`insert into diwaar_reviews (id, name, city, rating, body, created_at)
      values (${id}, ${data.name}, ${data.city}, ${data.rating}, ${data.body}, ${createdAt})`;
    return { id, createdAt };
  });
