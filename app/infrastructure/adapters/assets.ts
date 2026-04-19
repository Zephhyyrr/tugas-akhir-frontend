import { useRuntimeConfig } from '#app';
export const resolveAssetUrl = (path: string | null | undefined): string => {
    if (!path) return '';
    
    if (path.startsWith('http') || path.startsWith('data:')) {
        return path;
    }

    const config = useRuntimeConfig();
    const baseUrl = config.public.apiBaseUrl || 'http://localhost:3000';

    const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    return `${normalizedBase}${normalizedPath}`;
};
