import {
  BadgePercent,
  FerrisWheel,
  Gift,
  GraduationCap,
  MonitorPlay,
  Music,
  PartyPopper,
  Sparkles,
  Tag,
  TreePalm,
  Trophy,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  music: Music,
  palm: TreePalm,
  "ferris-wheel": FerrisWheel,
  utensils: UtensilsCrossed,
  sparkles: Sparkles,
  "monitor-play": MonitorPlay,
  "graduation-cap": GraduationCap,
  "party-popper": PartyPopper,
  gift: Gift,
  trophy: Trophy,
  "badge-percent": BadgePercent,
};

export function CategoryIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = icons[name] ?? Tag;
  return <Icon className={className} aria-hidden />;
}
