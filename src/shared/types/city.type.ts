const CITIES = ['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'] as const;
export type City = typeof CITIES[number];
export const AVAILABLE_CITIES_SET = new Set<string>(CITIES);
