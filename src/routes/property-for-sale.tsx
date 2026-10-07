import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/property-for-sale")({
  beforeLoad: () => {
    throw redirect({ to: "/search", search: { purpose: "buy" } });
  },
});
