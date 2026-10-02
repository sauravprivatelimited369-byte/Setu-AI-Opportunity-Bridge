"use client";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  label: string;
  value: string | number;
  sublabel?: string;
  accent?: "green" | "orange" | "blue" | "gray";
  href?: string;
};
export default function StatCard({ icon: Icon, label, value, sublabel, accent = "green", href }: Props) {
  const colorMap: Record<string, string> = {
    green: "bg-setu-100 text-setu-700",
    orange: "bg-orange-100 text-orange-700",
    blue: "bg-blue-100 text-blue-700",
    gray: "bg-gray-100 text-gray-700",
  };
  const inner = (
    <div className="card p-5 flex items-center gap-4 h-full">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorMap[accent]}`}>
        <Icon size={22} />
      </div>
      <div>
        <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</div>
        <div className="text-2xl font-extrabold text-ink-900 leading-tight">{value}</div>
        {sublabel && <div className="text-xs text-gray-500 mt-0.5">{sublabel}</div>}
      </div>
    </div>
  );
  if (href) return <Link href={href} className="block">{inner}</Link>;
  return inner;
}
