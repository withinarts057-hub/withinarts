import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { getStorageImageUrl } from "./supabase";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Resolves static public asset URLs.
 * Returns fast Supabase CDN URL, ensuring images load perfectly
 * on GitHub Pages, local dev, custom domain, or anywhere.
 */
export function resolveAssetUrl(url) {
  if (!url || typeof url !== 'string') return '';
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:') ||
    url.startsWith('blob:')
  ) {
    return url;
  }
  return getStorageImageUrl(url);
}
