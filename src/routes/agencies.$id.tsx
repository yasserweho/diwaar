import { createFileRoute, redirect } from "@tanstack/react-router";

/** Old sample agency pages were removed. Any agency URL goes to the agent directory page. */
export const Route = createFileRoute("/agencies/$id")({
  beforeLoad: () => {
    throw redirect({ to: "/agents", statusCode: 301 });
  },
});
