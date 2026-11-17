import { createFileRoute } from "@tanstack/react-router";
import { DirectoryEmpty } from "@/components/directory-empty";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/agencies/")({
  // No agencies are listed yet, so the page stays out of search results.
  head: () =>
    seo(
      "Real Estate Agencies in Pakistan",
      "The Diwaar agency directory is coming soon. Agencies can get in touch to be listed and post property free.",
      { path: "/agencies", noindex: true },
    ),
  component: AgenciesPage,
});

function AgenciesPage() {
  return <DirectoryEmpty kind="agencies" />;
}
