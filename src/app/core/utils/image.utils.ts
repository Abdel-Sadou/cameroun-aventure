import { environment } from '../../../environments/environment';

export function getImageUrl(
  apiUrl: string | null | undefined,
  localFallback: string
): string {
  if (!apiUrl) return localFallback;
  if (apiUrl.startsWith('http')) return apiUrl;
  if (apiUrl.startsWith('/uploads')) {
    return environment.uploadUrl + apiUrl.replace('/uploads', '');
  }
  return localFallback;
}

export const CIRCUIT_FALLBACK_IMAGES: Record<string, string> = {
  'trekking-mont-cameroun':         'assets/images/packages/p2-1.webp',
  'kribi-chutes-lobe-ocean':        'assets/images/packages/p2-2.webp',
  'safari-parc-waza-grand-nord':    'assets/images/packages/p2-3.webp',
  'pays-bamileke-foumban-royaumes': 'assets/images/packages/p2-4.webp',
  'grand-nord-monts-mandara':       'assets/images/packages/p1-5.webp',
  'foret-dja-peuples-baka':         'assets/images/packages/p1-4.webp',
  'douala-limbe-cote-atlantique':   'assets/images/packages/p1-7.webp',
  'ngaoundere-hauts-plateaux':      'assets/images/packages/p1-8.webp',
  'yaounde-culturel-musees':        'assets/images/packages/p1-9.webp',
};

export const DESTINATION_FALLBACK_IMAGES: Record<string, string> = {
  'est-cameroun':           'assets/images/destination/d1-1.webp',
  'grand-nord':             'assets/images/destination/d1-2.webp',
  'littoral-mont-cameroun': 'assets/images/destination/d1-3.webp',
  'grand-ouest':            'assets/images/destination/d1-4.webp',
  'sud-cameroun':           'assets/images/destination/d1-5.webp',
};
