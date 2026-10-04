const RENTAL_TYPES = ['apartment', 'house', 'room', 'hotel'] as const;
export type RentalType = typeof RENTAL_TYPES[number];
export const AVAILABLE_RENTAL_TYPES_SET = new Set<string>(RENTAL_TYPES);
