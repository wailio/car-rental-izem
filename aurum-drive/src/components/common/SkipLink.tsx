"use client";

import { usePathname } from "next/navigation";

export function SkipLink() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return (
    <a
      href="#main"
      className="skip-link"
      style={{
        position: "absolute",
        left: "-9999px",
        top: "auto",
        width: 1,
        height: 1,
        overflow: "hidden",
        zIndex: 9999,
        fontFamily: "var(--font-body)",
        fontSize: "var(--fs-small)",
        background: "var(--night-850)",
        color: "var(--gold)",
        padding: ".75rem 1.5rem",
        borderRadius: "0 0 var(--r-sm) var(--r-sm)",
        textDecoration: "none",
        border: "1px solid rgba(194,165,107,.4)",
      }}
      onFocus={(e) => {
        Object.assign((e.currentTarget as HTMLElement).style, {
          left: "1rem",
          top: "1rem",
          width: "auto",
          height: "auto",
          overflow: "visible",
        });
      }}
      onBlur={(e) => {
        Object.assign((e.currentTarget as HTMLElement).style, {
          left: "-9999px",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        });
      }}
    >
      Aller au contenu principal
    </a>
  );
}
