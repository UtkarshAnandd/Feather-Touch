import type { Route } from "next";

/** Admin modules. Each page enforces requireAdmin() itself; this list is navigation only. */
export const ADMIN_NAV: readonly { href: Route; label: string }[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/enquiries", label: "Enquiries" },
  { href: "/admin/slideshow", label: "Hero slideshow" },
  { href: "/admin/school-life", label: "School Life media" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/videos", label: "Videos" },
  { href: "/admin/media", label: "Media library" },
  { href: "/admin/reviews", label: "Parent reviews" },
  { href: "/admin/programmes", label: "Programmes" },
  { href: "/admin/faq", label: "FAQ" },
  { href: "/admin/settings", label: "School settings" },
  { href: "/admin/notifications", label: "Notifications" },
  { href: "/admin/audit", label: "Audit log" },
  { href: "/admin/account", label: "My account & 2FA" },
];
