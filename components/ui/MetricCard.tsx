import { Card } from "@/components/ui/card";

export function MetricCard({
  value,
  label
}: {
  value: string;
  label?: string;
}) {
  return (
    <Card className="group relative overflow-hidden p-5 transition hover:-translate-y-1 hover:border-sky-300/30">
      <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/40 to-transparent opacity-0 transition group-hover:opacity-100" />
      <p className="text-2xl font-semibold text-white">{value}</p>
      {label ? <p className="mt-2 text-sm text-slate-400">{label}</p> : null}
    </Card>
  );
}
