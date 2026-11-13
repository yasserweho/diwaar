/** Smart location search for Pakistani real-estate names.
 * Handles partial / abbreviated queries such as:
 *   "gulberg"      → Gulberg, Gulberg I, Gulberg II, Gulberg III
 *   "dha 5 g"      → DHA Phase 5 G Block
 *   "dha phase 5"  → all Phase 5 blocks
 */

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[.,/\-_()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Expand common short forms so "dha 5 g" matches "DHA Phase 5 G Block". */
function expandTokens(tokens: string[]): string[] {
  const out: string[] = [];
  for (const t of tokens) {
    out.push(t);
    // phase numbers written as digits
    if (/^\d+$/.test(t)) {
      out.push("phase", t);
    }
    // single letter blocks: g → block g
    if (/^[a-z]$/.test(t)) {
      out.push("block", t);
    }
    // roman numerals often used for Gulberg
    const roman: Record<string, string> = { "1": "i", "2": "ii", "3": "iii", "4": "iv", "5": "v" };
    if (roman[t]) out.push(roman[t]);
  }
  return out;
}

export function scoreLocation(label: string, rawQuery: string): number {
  const q = normalize(rawQuery);
  if (!q) return 0;
  const name = normalize(label);
  if (name === q) return 1000;
  if (name.startsWith(q)) return 800;
  if (name.includes(q)) return 600;

  const qTokens = expandTokens(q.split(" ").filter(Boolean));
  const nameTokens = name.split(" ").filter(Boolean);

  let matched = 0;
  for (const qt of qTokens) {
    if (nameTokens.some((nt) => nt === qt || nt.startsWith(qt) || (qt.length > 2 && nt.includes(qt)))) {
      matched++;
    }
  }
  // require most original query tokens to match (ignore the expanded extras for the threshold)
  const originalCount = q.split(" ").filter(Boolean).length;
  if (matched < Math.ceil(originalCount * 0.6)) return 0;

  // bonus for shorter names (more precise) and for starting with the first token
  let score = 200 + matched * 40;
  if (nameTokens[0] && qTokens.includes(nameTokens[0])) score += 50;
  if (name.length < 30) score += 20;
  return score;
}

export function rankLocations(
  options: readonly { value: string; label: string }[],
  query: string,
  limit = 30,
): { value: string; label: string }[] {
  const q = query.trim();
  if (!q) return options.slice(0, limit);

  const scored = options
    .map((o) => ({ o, s: scoreLocation(o.label, q) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || a.o.label.length - b.o.label.length);

  return scored.slice(0, limit).map((x) => x.o);
}
