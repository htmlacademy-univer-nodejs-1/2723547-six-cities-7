export type City =
  | 'Paris'
  | 'Cologne'
  | 'Brussels'
  | 'Amsterdam'
  | 'Hamburg'
  | 'Dusseldorf';

export type Amenity =
  | 'Breakfast'
  | 'Air conditioning'
  | 'Laptop friendly workspace'
  | 'Baby seat'
  | 'Washer'
  | 'Towels'
  | 'Fridge';

export type RentalType = 'apartment' | 'house' | 'room' | 'hotel';

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type Offer = {
  name: string;
  description: string;
  date: string;
  city: City;
  preview: string;
  photos: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: RentalType;
  roomsCount: number;
  guestsCount: number;
  price: number;
  amenities: Amenity[];
  userId: string;
  commentCount: number;
  location: Coordinates;
};
