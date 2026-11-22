/*
 * Patterns and data shapes used to read coursehunter.net pages.
 */

/**
 * Matches one lesson entry in the inline player script of a course page, e.g.
 * {"title": "1) 1.1. AE Basics | 00:31:36", "file": "https://vss4.coursehunter.net/.../lesson1.mp4", "subtitle": "", "id": "c3315l1"}
 */
export const reFileItem = /{"title"[ :]+"([\s\S]*?)"\s*,\s*"file"[ :]+"([^"]*?)"[^}]*},{0,1}/g;

/**
 * Lesson list URL the site uses to load items with axios: axios.get('/course/3787/lessons')
 */
export const reAxiosItemsQuery = /\/course\/\d{3,10}?\/lessons/;

/**
 * Course description from `<script type="application/ld+json">` (first element of the array).
 */
export interface CourseDescription {
    name: string;
    alternateName: string;
    datePublished: string;      // yyyy-mm-dd
    dateModified: string;       // yyyy-mm-dd
    creator: { '@type': string; name: string; }[];
    inLanguage: string;
    image: string;
    description: string;
    provider: CourseProvider[];
    isAccessibleForFree: boolean;
    '@id': string;
    about: { name: string; };
    aggregateRating: {
        '@type': string;
        bestRating: number;
        ratingValue: string;
        reviewCount: number;
        worstRating: number;
    };
    publisher: CourseProvider;
    '@context': string;
    '@type': string;
}

export interface CourseProvider {
    '@type': string;
    name: string;
    sameAs: string;
}
