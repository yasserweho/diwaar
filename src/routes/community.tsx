import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SEED_THREADS, type ForumPost } from "@/lib/portal";
import { useAppStore } from "@/lib/store";
import { SearchSelect } from "@/components/search-select";
import { CITIES } from "@/lib/types";

export const Route = createFileRoute("/community")({ component: CommunityPage });

function CommunityPage() {
  const extra = useAppStore((s) => s.threads);
  const add = useAppStore((s) => s.addThread);
  const posts = [...extra, ...SEED_THREADS];
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [city, setCity] = useState<string>(CITIES[0]);
  const [author, setAuthor] = useState("");

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Community</p>
      <h1 className="mt-1 text-3xl font-extrabold text-black">Ask the market</h1>
      <p className="mt-2 text-sm text-muted">Transfers, possession, rent and loans. Posts stay on this device.</p>

      <form
        className="mt-6 space-y-3 rounded-2xl bg-surface p-5 shadow-card"
        onSubmit={(e) => {
          e.preventDefault();
          if (title.trim().length < 8 || body.trim().length < 12 || author.trim().length < 2) {
            toast.error("Add a name, a title and a real question");
            return;
          }
          const post: ForumPost = {
            id: `me-${Date.now()}`,
            title: title.trim(),
            body: body.trim(),
            author: author.trim(),
            city,
            topic: "General",
            createdAt: new Date().toISOString().slice(0, 10),
            replies: [],
          };
          add(post);
          setTitle("");
          setBody("");
          toast.success("Posted");
        }}
      >
        <h2 className="font-bold">Start a thread</h2>
        <input className={field} placeholder="Your name" value={author} onChange={(e) => setAuthor(e.target.value)} />
        <SearchSelect
          value={city}
          searchPlaceholder="Type a city"
          options={CITIES.map((name) => ({ value: name, label: name }))}
          onChange={setCity}
        />
        <input className={field} placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea className={`${field} h-24 py-2`} placeholder="What do you want to know?" value={body} onChange={(e) => setBody(e.target.value)} />
        <Button type="submit">Post</Button>
      </form>

      <ul className="mt-6 space-y-3">
        {posts.map((p) => (
          <li key={p.id}>
            <Link to="/community/$id" params={{ id: p.id }} className="block rounded-xl bg-surface p-4 shadow-card hover:shadow-card-hover">
              <p className="text-xs font-semibold text-primary">
                {p.topic} · {p.city}
              </p>
              <p className="mt-1 font-bold">{p.title}</p>
              <p className="mt-1 line-clamp-2 text-sm text-muted">{p.body}</p>
              <p className="mt-2 text-xs text-muted">
                {p.author} · {p.replies.length} replies
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const field = "h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-primary";
