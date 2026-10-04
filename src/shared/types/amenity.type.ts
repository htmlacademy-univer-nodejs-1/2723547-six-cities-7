const AMENITIES = ['Breakfast', 'Air conditioning', 'Laptop friendly workspace', 'Baby seat', 'Washer', 'Towels', 'Fridge'] as const;
export type Amenity = typeof AMENITIES[number];
export const AVAILABLE_AMENITIES_SET = new Set<string>(AMENITIES);
