import { ReactNode } from "react";
import { Sparkles } from "lucide-react";

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
    <div className={`flex flex-col gap-4 ${alignment}`}>
      {eyebrow && (
        <div className="inline-flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[hsl(var(--quantum-cyan))]" />
          <span className="text-xs font-bold uppercase tracking-[0.25em] bg-gradient-to-r from-[hsl(var(--quantum-cyan))] to-[hsl(var(--quantum-azure))] bg-clip-text text-transparent">
            {eyebrow}
          </span>
        </div>
      )}
      <div className={`flex w-full flex-col gap-4 ${align === "center" ? "items-center" : "items-start"}`}>
        <h2 className="text-3xl font-bold tracking-tight text-[hsl(var(--quantum-ghost))] sm:text-4xl lg:text-5xl">
          {title}
        </h2>
        {description && (
          <p className={`max-w-2xl text-base leading-relaxed text-[hsl(var(--quantum-fog))] sm:text-lg ${align === "center" ? "text-center" : "text-left"}`}>
            {description}
          </p>
        )}
      </div>
      {actions ? <div className={`w-full ${align === "center" ? "flex justify-center" : ""}`}>{actions}</div> : null}
    </div>
  );
}
