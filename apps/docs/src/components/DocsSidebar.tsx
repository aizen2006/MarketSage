"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
};

const primary: NavItem[] = [
  { href: "/getting-started", label: "Getting started" },
  { href: "/agents", label: "Agents overview" },
];

const agents: NavItem[] = [
  { href: "/agents/quick", label: "Quick agent" },
  { href: "/agents/deep", label: "Deep agent" },
  { href: "/agents/auto", label: "Auto agent" },
];

const system: NavItem[] = [
  { href: "/errors", label: "Errors" },
  { href: "/changelog", label: "Changelog" },
];

function Section({
  title,
  items,
  pathname,
}: {
  title: string;
  items: NavItem[];
  pathname: string;
}) {
  return (
    <div className="mb-4">
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-fg-soft">
        {title}
      </div>
      <ul className="space-y-1">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block rounded-md px-2 py-1.5 text-xs transition-colors ${
                  active
                    ? "bg-accent-soft text-accent-strong"
                    : "text-fg-muted hover:bg-bg-subtle hover:text-fg"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function DocsSidebar() {
  const pathname = usePathname() || "/";

  return (
    <nav aria-label="Documentation" className="text-xs">
      <Section title="Basics" items={primary} pathname={pathname} />
      <Section title="Agents" items={agents} pathname={pathname} />
      <Section title="System" items={system} pathname={pathname} />
    </nav>
  );
}

