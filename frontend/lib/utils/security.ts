import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

export function sanitizeHTML(html: string): string {
    const window = new JSDOM('').window;
    const purify = DOMPurify(window as any);

    return purify.sanitize(html, {
        ALLOWED_TAGS: [
            'p', 'br', 'strong', 'em', 'u', 's',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'blockquote', 'ul', 'ol', 'li', 'a',
            'img', 'code', 'pre'
        ],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target', 'rel'],
        ALLOW_DATA_ATTR: false
    });
}

export function validateImageURL(url: string): boolean {
    if (!url) return true;
    return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(url);
}

export function validateSlug(slug: string): boolean {
    return /^[a-z0-9-]+$/.test(slug);
}

export function escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
} 