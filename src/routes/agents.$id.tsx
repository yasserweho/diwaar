import { createFileRoute, redirect } from "@tanstack/react-router";

/** Old sample agent profiles were removed. Any agent URL goes to the directory page. */
export const Route = createFileRoute("/agents/$id")({
  beforeLoad: () => {
    throw redirect({ to: "/agents", statusCode: 301 });
  },
});
