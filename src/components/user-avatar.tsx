"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

const GRADIENT_PAIRS: [string, string][] = [
  ["#6366f1", "#8b5cf6"], // indigo -> violet
  ["#ec4899", "#f43f5e"], // pink -> rose
  ["#14b8a6", "#06b6d4"], // teal -> cyan
  ["#f59e0b", "#ef4444"], // amber -> red
  ["#10b981", "#059669"], // emerald -> green
  ["#8b5cf6", "#ec4899"], // violet -> pink
  ["#06b6d4", "#3b82f6"], // cyan -> blue
  ["#f97316", "#f59e0b"], // orange -> amber
  ["#3b82f6", "#6366f1"], // blue -> indigo
  ["#84cc16", "#10b981"], // lime -> emerald
];

function getGradient(identifier: string): { from: string; to: string } {
  const hash = hashString(identifier);
  const pair = GRADIENT_PAIRS[hash % GRADIENT_PAIRS.length];
  return { from: pair[0], to: pair[1] };
}

function getInitials(name?: string | null, identifier?: string | null): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }
  if (identifier) {
    return identifier.slice(0, 2).toUpperCase();
  }
  return "?";
}

interface UserAvatarProps {
  imageUrl?: string | null;
  name?: string | null;
  identifier?: string | null;
  className?: string;
  fallbackClassName?: string;
}

export function UserAvatar({
  imageUrl,
  name,
  identifier,
  className,
  fallbackClassName,
}: UserAvatarProps) {
  const gradientKey = identifier ?? name ?? "unknown";
  const { from, to } = getGradient(gradientKey);
  const initials = getInitials(name, identifier);

  return (
    <Avatar className={className}>
      {imageUrl && (
        <AvatarImage
          src={imageUrl}
          alt={name ?? identifier ?? "User"}
        />
      )}
      <AvatarFallback
        className={cn("text-white font-medium", fallbackClassName)}
        style={{
          background: `linear-gradient(135deg, ${from}, ${to})`,
        }}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
