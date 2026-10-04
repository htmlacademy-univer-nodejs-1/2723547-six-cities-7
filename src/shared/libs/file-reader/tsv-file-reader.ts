import { FileReader } from './file-reader.interface.js';
import { readFileSync } from 'node:fs';
import { Amenity, City, Offer, RentalType, UserType, AVAILABLE_AMENITIES_SET, AVAILABLE_CITIES_SET, AVAILABLE_RENTAL_TYPES_SET } from '../../types/index.js';

export const isAvailableCity = (city: string): city is City => AVAILABLE_CITIES_SET.has(city);
export const isAvailableAmenity = (amenity: string): amenity is Amenity => AVAILABLE_AMENITIES_SET.has(amenity);
export const isAvailableRentalType = (type: string): type is RentalType => AVAILABLE_RENTAL_TYPES_SET.has(type);
export const toAmenityArray = (amenities: string[]): Amenity[] => amenities.filter((a): a is Amenity => isAvailableAmenity(a));

const isAvailableUserType = (type: string): type is UserType => type === 'basic' || type === 'pro';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) {}

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      throw new Error('File was not read');
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => line.split('\t'))
      .map(
        ([
          name,
          description,
          date,
          city,
          preview,
          photos,
          isPremium,
          isFavorite,
          rating,
          type,
          roomsCount,
          guestsCount,
          price,
          amenities,
          authorName,
          authorEmail,
          authorAvatar,
          authorPassword,
          authorType,
          location,
        ]) => ({
          name,
          description,
          date,
          city: isAvailableCity(city) ? city : 'Paris',
          preview,
          photos: photos.split(','),
          isPremium: isPremium === 'true',
          isFavorite: isFavorite === 'true',
          rating: Number.parseFloat(rating),
          type: isAvailableRentalType(type) ? type : 'apartment',
          roomsCount: Number.parseInt(roomsCount, 10),
          guestsCount: Number.parseInt(guestsCount, 10),
          price: Number.parseInt(price, 10),
          amenities: toAmenityArray(amenities.split(',')),
          author: {
            name: authorName,
            email: authorEmail,
            avatar: authorAvatar,
            password: authorPassword,
            type: isAvailableUserType(authorType) ? authorType : 'basic',
          },
          commentCount: 0,
          location: {
            latitude: Number(location.split(',')[0]),
            longitude: Number(location.split(',')[1]),
          },
        })
      );
  }
}
