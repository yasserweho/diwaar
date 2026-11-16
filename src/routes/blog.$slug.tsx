import { createFileRoute, Link } from "@tanstack/react-router";
import { Markdown } from "@/components/markdown";
import { PostFreeCta } from "@/components/post-free-cta";
import { PAGE, RelatedLinks } from "@/components/related-links";
import { ShareBar } from "@/components/share-bar";
import { POSTS } from "@/lib/data";
import { OG, seo } from "@/lib/seo";
import { blogPostingLd, breadcrumbLd, withSchema } from "@/lib/schema";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => {
    const post = POSTS.find((p) => p.slug === params.slug);
    if (!post) return seo("Article not found", "This Diwaar article is not available.", { noindex: true });
    const path = `/blog/${params.slug}`;
    return withSchema(
      seo(post.metaTitle ?? post.title, post.excerpt, {
        path,
        image: OG.blog(post.slug),
        imageAlt: post.title,
        type: "article",
        lang: post.lang,
      }),
      blogPostingLd(post, path),
      breadcrumbLd([
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blog" },
        { name: post.title, path },
      ]),
    );
  },
  component: PostPage,
});

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
  const ur = p.lang === "ur";
  const path = `/blog/${p.slug}`;
  return (
    <article className="mx-auto max-w-2xl px-4 py-8" lang={ur ? "ur" : "en"} dir={ur ? "rtl" : "ltr"}>
      <p className="text-[11px] font-bold uppercase tracking-wide text-primary">
        {p.tag} · <time dateTime={p.date}>{p.date}</time>
      </p>
      <h1 className={`mt-2 font-extrabold tracking-tight text-black ${ur ? "text-[1.75rem] leading-[1.6]" : "text-3xl"}`}>
        {p.title}
      </h1>
      <img src={p.image} alt={p.title} width={1200} height={675} className="mt-6 aspect-16/9 w-full rounded-2xl object-cover" />
      <ShareBar
        className="mt-6"
        path={path}
        campaign="article"
        compact
        forceLang={ur ? "ur" : undefined}
        en={`${p.title} (free guide on Diwaar.com)`}
        ur={`${p.title} — دیوار ڈاٹ کام پر مفت رہنمائی`}
      />
      <div className={`mt-6 ${ur ? "leading-[2] text-base" : ""}`}>
        {p.markdown ? (
          <Markdown source={p.markdown} />
        ) : (
          <div className="space-y-4 text-[15px] leading-relaxed">
            {p.body.map((para) => (
              <p key={para.slice(0, 24)}>{para}</p>
            ))}
          </div>
        )}
      </div>
      <ShareBar
        className="mt-8"
        path={path}
        campaign="article"
        forceLang={ur ? "ur" : undefined}
        title={{ en: "Know someone who needs this? Send it on WhatsApp.", ur: "کسی کو اس کی ضرورت ہے؟ واٹس ایپ پر بھیجیں۔" }}
        en={`${p.title} (free guide on Diwaar.com)`}
        ur={`${p.title} — دیوار ڈاٹ کام پر مفت رہنمائی`}
      />
      <PostFreeCta className="mt-6" />
      <RelatedLinks links={[PAGE.rent, PAGE.sale, PAGE.rentVsBuy, PAGE.transferCost, PAGE.locations, PAGE.guides]} />
      <Link to="/blog" className="mt-6 inline-block text-sm font-semibold text-primary">
        {ur ? "→ تمام مضامین" : "← All articles"}
      </Link>
    </article>
  );
}
