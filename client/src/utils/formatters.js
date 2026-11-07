// utils/formatters.js - Helper functions for currency, dates, URLs, and WhatsApp messaging

// Built-in high quality SVG placeholder image generators for categories when offline
const getCategorySvgFallback = (category = '') => {
  const cat = category.toLowerCase();
  let iconText = '📚';
  let bgGradient = '%234f46e5,%233730a3'; // indigo
  let label = 'Campus Book';

  if (cat.includes('laptop') || cat.includes('computer')) {
    iconText = '💻';
    bgGradient = '%230284c7,%230369a1'; // sky
    label = 'Laptop / Tech';
  } else if (cat.includes('calculator')) {
    iconText = '🔢';
    bgGradient = '%23059669,%23047857'; // emerald
    label = 'Scientific Calculator';
  } else if (cat.includes('drawing') || cat.includes('drafter')) {
    iconText = '📐';
    bgGradient = '%23d97706,%23b45309'; // amber
    label = 'Drawing Equipment';
  } else if (cat.includes('uniform')) {
    iconText = '👔';
    bgGradient = '%23475569,%23334155'; // slate
    label = 'School Uniform';
  } else if (cat.includes('notes')) {
    iconText = '📝';
    bgGradient = '%237c3aed,%236d28d9'; // violet
    label = 'Topper Notes';
  } else if (cat.includes('exam') || cat.includes('gate') || cat.includes('upsc')) {
    iconText = '🏆';
    bgGradient = '%23dc2626,%23b91c1c'; // rose
    label = 'Exam Prep Guide';
  }

  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${bgGradient.split(',')[0]}"/><stop offset="100%" stop-color="${bgGradient.split(',')[1]}"/></linearGradient></defs><rect width="600" height="450" fill="url(%23g)"/><text x="50%" y="45%" font-size="80" text-anchor="middle" dominant-baseline="middle">${iconText}</text><text x="50%" y="65%" font-size="24" font-weight="bold" fill="white" font-family="system-ui, sans-serif" text-anchor="middle">${label}</text><text x="50%" y="75%" font-size="16" fill="rgba(255,255,255,0.7)" font-family="system-ui, sans-serif" text-anchor="middle">CampusBazar Verified Listing</text></svg>`;
};

/**
 * Formats a number into Indian Rupee representation (e.g. ₹ 1,450)
 */
export const formatPrice = (price) => {
  if (price === undefined || price === null) return '₹ 0';
  return '₹ ' + Number(price).toLocaleString('en-IN');
};

/**
 * Formats a date into a human-readable relative time (e.g., '2 days ago', 'Today')
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'Recently';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInSeconds / 3600);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInSeconds / 86400);
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 30) return `${diffInDays} days ago`;

  return date.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Resolves full image URL.
 * Supports Cloudinary URLs, local uploads, or SVG fallbacks.
 */
export const getImageUrl = (imagePath, category = '') => {
  if (!imagePath) {
    return getCategorySvgFallback(category);
  }
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:image')) {
    return imagePath;
  }
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const serverHost = apiBase.replace(/\/api\/?$/, '');
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${serverHost}${cleanPath}`;
};

export { getCategorySvgFallback };

/**
 * Generates WhatsApp click-to-chat URL with prefilled greeting and item details
 */
export const createWhatsAppUrl = (phone, listingTitle, price) => {
  if (!phone) return '#';
  let cleanPhone = phone.replace(/[^0-9]/g, '');
  if (cleanPhone.length === 10) {
    cleanPhone = `91${cleanPhone}`;
  }
  const message = `Hi! I found your listing for "${listingTitle}" on CampusBazar (Price: ₹${price}). Is it still available? I would like to buy it on campus.`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};

/**
 * Sanitizes phone number for tel: links
 */
export const createTelUrl = (phone) => {
  if (!phone) return '#';
  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  return `tel:${cleanPhone}`;
};
