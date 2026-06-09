import DOMPurify from 'dompurify';

/**
 * Sanitize a string to prevent XSS — strips all HTML tags
 * @param {string} input
 * @returns {string}
 */
export function sanitizeText(input) {
  if (typeof input !== 'string') return '';
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}

/**
 * Sanitize HTML content, allowing a safe subset of tags
 * @param {string} html
 * @returns {string}
 */
export function sanitizeHtml(html) {
  if (typeof html !== 'string') return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'a', 'h3', 'h4'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    FORCE_BODY: true,
  });
}

/**
 * Sanitize AI-generated markdown-style response text
 * Allows basic formatting but strips dangerous content
 * @param {string} text
 * @returns {string}
 */
export function sanitizeAiResponse(text) {
  if (typeof text !== 'string') return '';
  // Strip script tags and event handlers before passing to DOMPurify
  const cleaned = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  return DOMPurify.sanitize(cleaned, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'h3', 'h4', 'code', 'pre'],
    ALLOWED_ATTR: [],
  });
}

/**
 * Strip all HTML and return plain text
 * @param {string} html
 * @returns {string}
 */
export function htmlToText(html) {
  return sanitizeText(html);
}
