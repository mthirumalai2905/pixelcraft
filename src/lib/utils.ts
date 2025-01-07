import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const rgbaToHex = (rgba: string): string => {
  if (!rgba || rgba === "transparent") return "transparent";

  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!match) return rgba;

  const [, r, g, b, a = "1"] = match;

  const toHex = (n: string) => {
    const hex = parseInt(n).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;

  return parseFloat(a) !== 1
    ? `${hex}${toHex(Math.round(parseFloat(a) * 255).toString())}`
    : hex;
};
