const BASE = import.meta.env.BASE_URL; // e.g. "/Simon/"

// Prefix a root-relative app path with the configured base.
// External URLs (http, mailto, etc.) and anchors pass through untouched.
export function withBase(path: string): string {
  if (/^([a-z]+:)?\/\//i.test(path) || path.startsWith("mailto:") || path.startsWith("#")) {
    return path;
  }
  const base = BASE.replace(/\/$/, "");
  const rest = path.replace(/^\//, "");
  return rest ? `${base}/${rest}` : `${base}/`;
}

// True if `href` matches the current pathname, ignoring the base prefix.
export function isActivePath(currentPathname: string, href: string): boolean {
  const base = BASE.replace(/\/$/, "");
  const strip = (p: string) => {
    let s = p.startsWith(base) ? p.slice(base.length) : p;
    s = s.replace(/\/$/, "");
    return s === "" ? "/" : s;
  };
  const cur = strip(currentPathname);
  const target = strip(href);
  return target === "/" ? cur === "/" : cur === target || cur.startsWith(target + "/");
}
