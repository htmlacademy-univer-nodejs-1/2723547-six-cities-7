import { Amenity, City, Coordinates, RentalType } from '../../../types/index.js';

export class CreateOfferDto {
  public name: string;
  public description: string;
  public date: Date;
  public city: City;
  public preview: string;
  public photos: string[];
  public isPremium: boolean;
  public isFavorite: boolean;
  public rating: number;
  public type: RentalType;
  public roomsCount: number;
  public guestsCount: number;
  public price: number;
  public amenities: Amenity[];
  public author: string;
  public location: Coordinates;
}
