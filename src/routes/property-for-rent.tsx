import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/property-for-rent")({
  beforeLoad: () => {
    throw redirect({ to: "/search", search: { purpose: "rent" } });
  },
});
