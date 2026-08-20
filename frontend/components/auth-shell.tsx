import { BoardIcon } from "@/components/icons";

/**
 * Centered, branded container shared by the login and register screens.
 */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <BoardIcon className="h-6 w-6" />
          </span>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">
            {title}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground text-pretty">
            {subtitle}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-xl shadow-black/20">
          {children}
        </div>

        {footer ? (
          <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
        ) : null}
      </div>
    </main>
  );
}

/** Reusable labelled input with an optional leading icon. */
export function Field({
  id,
  label,
  icon,
  ...props
}: {
  id: string;
  label: string;
  icon?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </span>
        ) : null}
        <input
          id={id}
          className={`w-full rounded-md border border-border bg-input py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30 ${
            icon ? "pl-10 pr-3" : "px-3"
          }`}
          {...props}
        />
      </div>
    </div>
  );
}
