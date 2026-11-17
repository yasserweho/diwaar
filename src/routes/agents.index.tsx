import { createFileRoute } from "@tanstack/react-router";
import { DirectoryEmpty } from "@/components/directory-empty";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/agents/")({
  // No agents are listed yet, so the page stays out of search results.
  head: () =>
    seo(
      "Property Agents in Pakistan",
      "The Diwaar agent directory is coming soon. Agents can list their agency and post property free.",
      { path: "/agents", noindex: true },
    ),
  component: AgentsPage,
});

function AgentsPage() {
  return <DirectoryEmpty kind="agents" />;
}
