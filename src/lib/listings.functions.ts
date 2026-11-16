import { createServerFn } from "@tanstack/react-start";
import { activeListings } from "./listings.server";
import { PUBLIC_ID } from "./listings.shared";
import type { Property } from "./types";

export type ListingFilter = {
  purpose?: "buy" | "rent";
  city?: string;
  location?: string;
  type?: string;
  limit?: number;
};

function asFilter(input: ListingFilter | undefined): ListingFilter {
  const f = input ?? {};
  return {
    purpose: f.purpose === "rent" ? "rent" : f.purpose === "buy" ? "buy" : undefined,
    city: typeof f.city === "string" ? f.city.slice(0, 60) : undefined,
    location: typeof f.location === "string" ? f.location.slice(0, 120) : undefined,
    type: typeof f.type === "string" ? f.type.slice(0, 20) : undefined,
    limit: Math.min(Math.max(Math.round(Number(f.limit) || 500), 1), 500),
  };
}

export const listPublicListings = createServerFn({ method: "GET" })
  .validator((input: ListingFilter | undefined) => asFilter(input))
  .handler(async ({ data }) => {
    const all = await activeListings();
    return all
      .filter(
        (p) =>
          (!data.purpose || p.purpose === data.purpose) &&
          (!data.city || p.city === data.city) &&
          (!data.location || p.location === data.location || p.areaName === data.location) &&
          (!data.type || p.category === data.type),
      )
      .slice(0, data.limit);
  });

export const getPublicListing = createServerFn({ method: "GET" })
  .validator((input: { id: string }) => ({ id: String(input?.id ?? "").slice(0, 40) }))
  .handler(async ({ data }): Promise<Property | null> => {
    if (!PUBLIC_ID.test(data.id)) return null;
    const all = await activeListings();
    return all.find((p) => p.id === data.id) ?? null;
  });
