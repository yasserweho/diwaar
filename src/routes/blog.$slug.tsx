import { createFileRoute, Link } from "@tanstack/react-router";
import { PAGE, RelatedLinks } from "@/components/related-links";
import { POSTS } from "@/lib/data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => {
    const post = POSTS.find((p) => p.slug === params.slug);
    if (!post) return seo("Article not found", "This Diwaar article is not available.", { noindex: true });
    return seo(post.title, post.excerpt, { path: `/blog/${params.slug}` });
  },
  component: PostPage });

function PostPage() {
  const { slug } = Route.useParams();
  const p = POSTS.find((x) => x.slug === slug);
  if (!p) {
    return (
      <div className="px-4 py-20 text-center">
        <p className="font-bold">Article not found</p>
        <Link to="/blog" className="text-primary text-sm font-semibold">
          All articles
        </Link>
      </div>
    );
  }
  return (
    <article className="mx-auto max-w-2xl px-4 py-8">
      <p className="text-[11px] font-bold uppercase tracking-wide text-primary">
        {p.tag} · {p.date}
      </p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-black">{p.title}</h1>
      <img src={p.image} alt={p.title} className="mt-6 aspect-16/9 w-full rounded-2xl object-cover" />
      <div className="mt-6 space-y-4 text-[15px] leading-relaxed">
        {p.body.map((para) => (
          <p key={para.slice(0, 24)}>{para}</p>
        ))}
      </div>
      <RelatedLinks links={[PAGE.sale, PAGE.locations, PAGE.guides, PAGE.services, PAGE.index]} />
      <Link to="/blog" className="mt-6 inline-block text-sm font-semibold text-primary">
        ← All articles
      </Link>
    </article>
  );
}
