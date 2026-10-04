import { Amenity } from './amenity.type.js';
import { City } from './city.type.js';
import { Coordinates } from './coordinates.type.js';
import { RentalType } from './rental-type.type.js';
import { User } from './user.type.js';

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
  author: User;
  commentCount: number;
  location: Coordinates;
};
