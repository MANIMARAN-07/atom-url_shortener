import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(dateString) {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function truncate(str, maxLength = 40) {
  if (!str || str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '…';
}

export function getBaseUrl() {
  return window.location.origin;
}

export function buildShortUrl(url) {
  const code = url.customAlias || url.shortCode;
  return `${getBaseUrl()}/${code}`;
}
