import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "~/lib/utils";

/**
 * The furniture every admin section is built from — the same five pieces used
 * across the Korvix admin, so sections differ only where the data differs.
 *
 *   <AdminPageHeader>  title + description + primary action
 *   <AdminToolbar>     the row above a list: filters left, actions right
 *   <AdminCard>        the bordered white surface a list or form sits on
 *   <AdminEmpty>       the empty state, same shape everywhere
 *   <StatGrid/StatCard> the stat row
 */

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
      <div className="min-w-0">
        <h1 className="font-heading text-[26px] font-extrabold leading-[34px] tracking-[-0.01em] text-slate-900">
          {title}
        </h1>
        {description && (
          <p className="mt-1 max-w-[68ch] text-[14px] leading-[22px] text-slate-600">
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex shrink-0 items-center gap-3">{action}</div>}
    </div>
  );
}

export function AdminToolbar({
  children,
  action,
}: {
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
      <div className="flex min-w-0 flex-wrap items-center gap-2">{children}</div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>
  );
}

export function AdminCard({
  children,
  className,
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-white shadow-sm",
        padded && "p-4 sm:p-5",
        className
      )}
    >
      {children}
    </div>
  );
}

export function AdminEmpty({
  icon: Icon,
  title,
  text,
  action,
}: {
  icon: LucideIcon;
  title: string;
  text?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-slate-100">
        <Icon className="size-6 text-slate-400" />
      </div>
      <p className="font-heading text-[15px] font-bold text-slate-900">{title}</p>
      {text && (
        <p className="mx-auto mt-1 max-w-sm text-[13px] leading-[20px] text-slate-600">
          {text}
        </p>
      )}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

/** Two-up from the smallest screen so four cards don't fill a phone viewport. */
export function StatGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">{children}</div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  urgent,
  onClick,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  urgent?: boolean;
  onClick?: () => void;
}) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      className={cn(
        "group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-3 text-left shadow-sm sm:p-4",
        onClick && "transition-colors hover:border-primary-500/60"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-[10px] font-bold uppercase leading-[14px] tracking-[0.08em] text-slate-500 sm:text-[11px] sm:leading-[16px]">
          {label}
        </span>
        <Icon
          className={cn(
            "size-4 shrink-0 transition-colors",
            urgent ? "text-primary-500" : "text-slate-400",
            onClick && "group-hover:text-primary-500"
          )}
        />
      </div>
      {/* Money can be 9 characters; step it down so "$9,367.65" never wraps
          inside a half-width phone card. */}
      <p
        className={cn(
          "mt-2 font-heading font-extrabold tabular-nums tracking-[-0.02em] text-slate-900 sm:mt-3",
          "text-[24px] leading-[30px] sm:text-[30px] sm:leading-[38px]",
          value.length > 6 && "text-[20px] sm:text-[26px]"
        )}
      >
        {value}
      </p>
      {hint && (
        <p className="mt-0.5 text-[11px] leading-[16px] text-slate-500 sm:text-[12px] sm:leading-[18px]">
          {hint}
        </p>
      )}
    </Tag>
  );
}

/** Consistent status chip. */
export function StatusBadge({
  status,
  tone,
}: {
  status: string;
  tone?: "green" | "amber" | "red" | "slate" | "orange";
}) {
  const auto: Record<string, string> = {
    active: "green", paid: "green", processed: "green", published: "green",
    sent: "amber", pending: "amber", draft: "slate",
    overdue: "red", failed: "red",
    purged: "slate", void: "slate", expired: "slate", cancelled: "slate",
  };
  const t = tone || (auto[status.toLowerCase()] as any) || "slate";
  const map = {
    green: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    amber: "bg-amber-50 text-amber-800 ring-amber-600/20",
    red: "bg-red-50 text-red-700 ring-red-600/20",
    slate: "bg-slate-100 text-slate-600 ring-slate-500/20",
    orange: "bg-primary-50 text-primary-500 ring-primary-500/20",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ring-inset",
        map[t as keyof typeof map]
      )}
    >
      {status}
    </span>
  );
}

/** Primary / secondary buttons so actions look the same everywhere. */
export function AdminButton({
  children,
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
}) {
  const variants = {
    primary:
      "bg-primary-500 text-white hover:bg-primary-600 shadow-sm",
    secondary:
      "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    danger: "text-red-600 hover:bg-red-50",
  };
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-semibold transition-colors disabled:opacity-50",
        variants[variant],
        className
      )}
    >
      {children}
    </button>
  );
}
