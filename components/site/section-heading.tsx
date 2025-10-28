import { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  actions?: ReactNode;
}

export function SectionHeading({ eyebrow, title, description, align = "left", actions }: SectionHeadingProps) {
  const alignment = align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={`flex flex-col gap-3 ${alignment}`}>
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/80">
          {eyebrow}
        </span>
      )}
      <div className={`flex w-full flex-col gap-3 ${align === "center" ? "items-center" : "items-start"}`}>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h2>
        {description && (
          <p className={`max-w-2xl text-sm text-muted-foreground sm:text-base ${align === "center" ? "text-center" : "text-left"}`}>
            {description}
          </p>
        )}
      </div>
      {actions ? <div className={`w-full ${align === "center" ? "flex justify-center" : ""}`}>{actions}</div> : null}
    </div>
  );
}
