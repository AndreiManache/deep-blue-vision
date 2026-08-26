import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

interface BackHeaderProps {
  title: string;
  subtitle: string;
}

export function BackHeader({ title, subtitle }: BackHeaderProps) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-4">
      <button
        className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white shadow-sm ring-1 ring-ink/5 transition-colors hover:bg-ink3"
        onClick={() => void navigate({ to: "/" })}
        aria-label="Back"
      >
        <ArrowLeft className="size-5 text-ink/70" />
      </button>
      <div>
        <h1 className="font-display text-3xl font-extrabold leading-none tracking-tight text-ink">
          {title}
        </h1>
        <p className="mt-1 text-sm font-medium text-ink/50">{subtitle}</p>
      </div>
    </div>
  );
}
