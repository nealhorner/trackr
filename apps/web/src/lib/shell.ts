import { derived, type Readable } from "svelte/store";

import { page } from "$app/stores";

export type ShellTab = { label: string; href: string };

export type ShellState = {
  contextTitle: string;
  tabs: ShellTab[];
};

/** Derives top-bar title and tab strip from the active pathname (Phase 0 shell contract). */
export function createShellState(): Readable<ShellState> {
  return derived(page, ($page) => {
    const path = $page.url.pathname;
    const defaultTabs: ShellTab[] = [
      { label: "Overview", href: "/" },
      { label: "Recent", href: "/your-work" },
    ];

    if (path === "/" || path === "") {
      return { contextTitle: "Home", tabs: defaultTabs };
    }
    if (path.startsWith("/your-work")) {
      return {
        contextTitle: "Your Work",
        tabs: [
          { label: "Assigned", href: "/your-work" },
          { label: "Mentions", href: "/your-work" },
        ],
      };
    }
    if (path.startsWith("/organizations")) {
      return {
        contextTitle: "Organizations",
        tabs: [
          { label: "List", href: "/organizations" },
          { label: "Members", href: "/organizations" },
        ],
      };
    }
    if (path.startsWith("/projects")) {
      return {
        contextTitle: "Projects",
        tabs: [
          { label: "Board", href: "/projects" },
          { label: "Backlog", href: "/projects" },
        ],
      };
    }
    if (path.startsWith("/analytics")) {
      return {
        contextTitle: "Analytics",
        tabs: [{ label: "Overview", href: "/analytics" }],
      };
    }
    if (path.startsWith("/settings")) {
      return {
        contextTitle: "Settings",
        tabs: [
          { label: "Profile", href: "/settings" },
          { label: "Notifications", href: "/settings" },
        ],
      };
    }
    if (path.startsWith("/favorites")) {
      return {
        contextTitle: "Favorites",
        tabs: [{ label: "Saved", href: "/favorites" }],
      };
    }

    return { contextTitle: "Trackr", tabs: defaultTabs };
  });
}
