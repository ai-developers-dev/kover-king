import {
  LayoutDashboard,
  FileText,
  Mail,
  Receipt,
  CreditCard,
  Newspaper,
  Users,
  Lightbulb,
  Send,
  Building2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// One source of truth for the admin sections. The sidebar renders it and the
// top bar reads the current page's title out of it — adding a section here is
// the whole change.
//
// This dashboard keeps its tab state in React rather than the URL, so `id`
// is the Tab union value, not a route.

export type AdminTabId =
  | "quotes"
  | "contacts"
  | "billing"
  | "payments"
  | "blog"
  | "authors"
  | "ideas"
  | "outreach"
  | "directories";

export type AdminNavItem = {
  id: AdminTabId;
  label: string;
  icon: LucideIcon;
  /** Shown under the page title. */
  description: string;
};

export type AdminNavGroup = {
  label: string;
  items: ReadonlyArray<AdminNavItem>;
};

/** Grouped in the order the daily job runs: leads in, money out, then marketing. */
export const ADMIN_NAV: ReadonlyArray<AdminNavGroup> = [
  {
    label: "Pipeline",
    items: [
      {
        id: "quotes",
        label: "Quotes",
        icon: FileText,
        description: "Quote requests from the website and landing pages.",
      },
      {
        id: "contacts",
        label: "Contacts",
        icon: Mail,
        description: "Messages sent through the contact forms.",
      },
    ],
  },
  {
    label: "Billing",
    items: [
      {
        id: "billing",
        label: "Billing",
        icon: Receipt,
        description: "Create bills, manage policies, and upload ID cards.",
      },
      {
        id: "payments",
        label: "Payments",
        icon: CreditCard,
        description:
          "Payment details submitted by customers, ready to key into a carrier portal.",
      },
    ],
  },
  {
    label: "Marketing",
    items: [
      {
        id: "blog",
        label: "Blog",
        icon: Newspaper,
        description: "Write, generate, and publish posts.",
      },
      {
        id: "authors",
        label: "Authors",
        icon: Users,
        description: "Bylines and author photos.",
      },
      {
        id: "ideas",
        label: "Keyword Ideas",
        icon: Lightbulb,
        description: "Weekly long-tail SEO opportunities from the research agent.",
      },
      {
        id: "outreach",
        label: "Outreach",
        icon: Send,
        description: "Backlink prospects and outreach drafts.",
      },
      {
        id: "directories",
        label: "Link Opportunities",
        icon: Building2,
        description: "Local citations and directory listings.",
      },
    ],
  },
];

export const ADMIN_NAV_ITEMS: ReadonlyArray<AdminNavItem> = ADMIN_NAV.flatMap(
  (g) => g.items
);

export function navItem(id: AdminTabId): AdminNavItem | undefined {
  return ADMIN_NAV_ITEMS.find((i) => i.id === id);
}

export { LayoutDashboard };
