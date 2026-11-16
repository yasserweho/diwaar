import { Fragment, type ReactNode } from "react";

/**
 * Minimal, dependency-free Markdown renderer for the site's own articles
 * (headings, paragraphs, lists, block quotes, tables, rules, **bold**,
 * *italic*, [links](url) and bare URLs). Builds React elements, never raw HTML.
 */
export function Markdown({ source }: { source: string }) {
  return <div className="article-md space-y-4 text-[15px] leading-relaxed">{blocks(source)}</div>;
}

function inline(text: string, keyBase = "i"): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(\[([^\]]+)\]\(([^)\s]+)\))|(https?:\/\/[^\s)<]+[^\s)<.,;:!?'"])/g;
  let last = 0;
  let n = 0;
  for (const m of text.matchAll(re)) {
    const at = m.index ?? 0;
    if (at > last) out.push(text.slice(last, at));
    const key = `${keyBase}-${n++}`;
    if (m[2]) out.push(<strong key={key}>{inline(m[2], key)}</strong>);
    else if (m[4]) out.push(<em key={key}>{inline(m[4], key)}</em>);
    else if (m[6]) out.push(link(m[7], inline(m[6], key), key));
    else if (m[8]) out.push(link(m[8], m[8], key));
    last = at + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function link(href: string, children: ReactNode, key: string) {
  const external = /^https?:\/\//.test(href);
  return (
    <a
      key={key}
      href={href}
      className="break-words font-semibold text-primary underline-offset-2 hover:underline"
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

function cells(row: string) {
  return row
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((c) => c.trim());
}

function blocks(src: string): ReactNode[] {
  const lines = src.replace(/\r/g, "").split("\n");
  const out: ReactNode[] = [];
  let i = 0;
  let k = 0;
  while (i < lines.length) {
    const line = lines[i];
    const key = `b${k++}`;
    if (!line.trim()) {
      i++;
      continue;
    }
    if (/^---+\s*$/.test(line)) {
      out.push(<hr key={key} className="my-6 border-border" />);
      i++;
      continue;
    }
    const h = /^(#{1,4})\s+(.*)$/.exec(line);
    if (h) {
      const level = h[1].length;
      const cls =
        level <= 2
          ? "mt-8 text-xl font-bold text-black"
          : "mt-6 text-lg font-semibold text-black";
      out.push(
        level <= 2 ? (
          <h2 key={key} className={cls}>
            {inline(h[2], key)}
          </h2>
        ) : (
          <h3 key={key} className={cls}>
            {inline(h[2], key)}
          </h3>
        ),
      );
      i++;
      continue;
    }
    if (line.startsWith(">")) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].startsWith(">")) buf.push(lines[i++].replace(/^>\s?/, ""));
      out.push(
        <blockquote key={key} className="rounded-xl border border-border bg-ice px-4 py-3">
          {buf
            .join("\n")
            .split(/\n\s*\n/)
            .map((para, j) => (
              <p key={j} className={j ? "mt-2" : undefined}>
                {para.split("\n").map((l, x) => (
                  <Fragment key={x}>
                    {x > 0 && <br />}
                    {inline(l, `${key}-${j}-${x}`)}
                  </Fragment>
                ))}
              </p>
            ))}
        </blockquote>,
      );
      continue;
    }
    if (line.trim().startsWith("|") && i + 1 < lines.length && /^\s*\|?\s*:?-{2,}/.test(lines[i + 1])) {
      const head = cells(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) rows.push(cells(lines[i++]));
      out.push(
        <div key={key} className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-ice">
              <tr>
                {head.map((c, j) => (
                  <th key={j} className="px-3 py-2 text-start font-semibold">
                    {inline(c, `${key}-h${j}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <tr key={ri} className="border-t border-border">
                  {r.map((c, j) => (
                    <td key={j} className="px-3 py-2 align-top">
                      {inline(c, `${key}-${ri}-${j}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }
    const ordered = /^\d+\.\s+/.test(line);
    if (ordered || /^[-*]\s+/.test(line)) {
      const items: string[] = [];
      const re = ordered ? /^\d+\.\s+/ : /^[-*]\s+/;
      while (i < lines.length && re.test(lines[i])) items.push(lines[i++].replace(re, ""));
      const cls = `${ordered ? "list-decimal" : "list-disc"} space-y-1.5 ps-6`;
      const lis = items.map((it, j) => <li key={j}>{inline(it, `${key}-${j}`)}</li>);
      out.push(
        ordered ? (
          <ol key={key} className={cls}>
            {lis}
          </ol>
        ) : (
          <ul key={key} className={cls}>
            {lis}
          </ul>
        ),
      );
      continue;
    }
    const buf: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,4}\s|>|---+\s*$|\d+\.\s|[-*]\s|\s*\|)/.test(lines[i])
    )
      buf.push(lines[i++]);
    if (!buf.length) {
      buf.push(lines[i++]);
    }
    out.push(
      <p key={key}>
        {buf.map((l, x) => (
          <Fragment key={x}>
            {x > 0 && <br />}
            {inline(l, `${key}-${x}`)}
          </Fragment>
        ))}
      </p>,
    );
  }
  return out;
}
