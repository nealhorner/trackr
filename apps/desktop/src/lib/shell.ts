export type ShellTab = { label: string; href: string };

export type ShellState = {
  contextTitle: string;
  tabs: ShellTab[];
};

export function shellStateFromPath(path: string): ShellState {
  const defaultTabs: ShellTab[] = [
    { label: "Overview", href: "/" },
    { label: "Projects", href: "/projects" },
  ];

  if (path === "/" || path === "") {
    return { contextTitle: "Home", tabs: defaultTabs };
  }
  if (path.startsWith("/projects/")) {
    const m = path.match(/^\/projects\/(\d+)/);
    const id = m?.[1];
    if (!id) {
      return {
        contextTitle: "Projects",
        tabs: [{ label: "All", href: "/projects" }],
      };
    }
    if (path.includes("/board")) {
      return {
        contextTitle: "Board",
        tabs: [
          { label: "Board", href: `/projects/${id}/board` },
          { label: "Project", href: `/projects/${id}` },
        ],
      };
    }
    if (path.includes("/tickets/")) {
      return {
        contextTitle: "Ticket",
        tabs: [
          { label: "Details", href: path },
          { label: "Board", href: `/projects/${id}/board` },
        ],
      };
    }
    return {
      contextTitle: "Project",
      tabs: [
        { label: "Overview", href: `/projects/${id}` },
        { label: "Board", href: `/projects/${id}/board` },
      ],
    };
  }
  if (path.startsWith("/settings")) {
    return {
      contextTitle: "Settings",
      tabs: [{ label: "Local Data", href: "/settings" }],
    };
  }
  if (path.startsWith("/projects")) {
    return {
      contextTitle: "Projects",
      tabs: [{ label: "All", href: "/projects" }],
    };
  }
  return { contextTitle: "Trackr Desktop", tabs: defaultTabs };
}
