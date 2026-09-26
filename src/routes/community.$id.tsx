import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SEED_THREADS } from "@/lib/portal";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/community/$id")({ component: ThreadPage });

function ThreadPage() {
  const { id } = Route.useParams();
  const mine = useAppStore((s) => s.threads);
  const extra = useAppStore((s) => s.extraReplies[id] ?? []);
  const addReply = useAppStore((s) => s.addReply);
  const post = [...mine, ...SEED_THREADS].find((t) => t.id === id);
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");

  if (!post) {
    return (
      <div className="px-4 py-20 text-center">
        <p className="font-bold">Thread not found</p>
        <Link to="/community" className="text-sm font-semibold text-primary">
          Back to community
        </Link>
      </div>
    );
  }

  const replies = [...post.replies, ...extra];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link to="/community" className="text-sm font-semibold text-muted hover:text-primary">
        Community
      </Link>
      <p className="mt-4 text-xs font-bold uppercase tracking-wide text-primary">
        {post.topic} · {post.city}
      </p>
      <h1 className="mt-1 text-2xl font-extrabold text-primary-dark">{post.title}</h1>
      <p className="mt-3 leading-relaxed">{post.body}</p>
      <p className="mt-2 text-xs text-muted">
        {post.author} · {post.createdAt}
      </p>
      <ul className="mt-6 space-y-3">
        {replies.map((r, i) => (
          <li key={`${r.author}-${i}`} className="rounded-xl bg-surface p-4 shadow-card">
            <p className="text-sm font-bold">{r.author}</p>
            <p className="mt-1 text-sm">{r.body}</p>
          </li>
        ))}
      </ul>
      <form
        className="mt-6 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (author.trim().length < 2 || body.trim().length < 4) {
            toast.error("Add your name and a reply");
            return;
          }
          addReply(id, { author: author.trim(), body: body.trim() });
          setBody("");
          toast.success("Reply added");
        }}
      >
        <input className={field} placeholder="Your name" value={author} onChange={(e) => setAuthor(e.target.value)} />
        <textarea className={`${field} h-24 py-2`} placeholder="Reply" value={body} onChange={(e) => setBody(e.target.value)} />
        <Button type="submit">Reply</Button>
      </form>
    </div>
  );
}

const field = "h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-primary";
