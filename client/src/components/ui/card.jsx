import { cn } from "../../lib/utils";

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-gray-800 bg-gray-900/50 text-gray-100 shadow-sm",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return (
    <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ className, ...props }) {
  return (
    <p
      className={cn("text-sm text-gray-400", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}
