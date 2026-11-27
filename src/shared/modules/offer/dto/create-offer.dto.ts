import {
  IsArray,
  ArrayMaxSize,
  ArrayMinSize,
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsString,
  IsUrl,
  Length,
  Max,
  Min,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  Amenity,
  AVAILABLE_AMENITIES_SET,
  AVAILABLE_CITIES_SET,
  AVAILABLE_RENTAL_TYPES_SET,
  City,
  Coordinates,
  RentalType
} from '../../../types/index.js';
import { CreateOfferMessages } from './create-offer.messages.js';
import { LocationDto } from './location.dto.js';

export class CreateOfferDto {
  @IsString({ message: CreateOfferMessages.name.invalidFormat })
  @Length(10, 100, { message: CreateOfferMessages.name.lengthField })
  public name: string;

  @IsString({ message: CreateOfferMessages.description.invalidFormat })
  @Length(20, 1024, { message: CreateOfferMessages.description.lengthField })
  public description: string;

  @IsDateString({}, { message: CreateOfferMessages.date.invalidFormat })
  public date: Date;

  @IsIn([...AVAILABLE_CITIES_SET], { message: CreateOfferMessages.city.invalid })
  public city: City;

  @IsUrl({}, { message: CreateOfferMessages.preview.invalidUrl })
  public preview: string;

  @IsArray({ message: CreateOfferMessages.photos.invalidFormat })
  @ArrayMinSize(6, { message: CreateOfferMessages.photos.countField })
  @ArrayMaxSize(6, { message: CreateOfferMessages.photos.countField })
  @IsUrl({}, { each: true, message: CreateOfferMessages.photos.invalidFormat })
  public photos: string[];

  @IsBoolean({ message: CreateOfferMessages.isPremium.invalidFormat })
  public isPremium: boolean;

  @Min(1, { message: CreateOfferMessages.rating.minValue })
  @Max(5, { message: CreateOfferMessages.rating.maxValue })
  public rating: number;

  @IsIn([...AVAILABLE_RENTAL_TYPES_SET], { message: CreateOfferMessages.type.invalid })
  public type: RentalType;

  @IsInt({ message: CreateOfferMessages.roomsCount.invalidFormat })
  @Min(1, { message: CreateOfferMessages.roomsCount.minValue })
  @Max(8, { message: CreateOfferMessages.roomsCount.maxValue })
  public roomsCount: number;

  @IsInt({ message: CreateOfferMessages.guestsCount.invalidFormat })
  @Min(1, { message: CreateOfferMessages.guestsCount.minValue })
  @Max(10, { message: CreateOfferMessages.guestsCount.maxValue })
  public guestsCount: number;

  @IsInt({ message: CreateOfferMessages.price.invalidFormat })
  @Min(100, { message: CreateOfferMessages.price.minValue })
  @Max(100000, { message: CreateOfferMessages.price.maxValue })
  public price: number;

  @IsArray({ message: CreateOfferMessages.amenities.invalidFormat })
  @IsIn([...AVAILABLE_AMENITIES_SET], { each: true, message: CreateOfferMessages.amenities.invalidItem })
  public amenities: Amenity[];

  @ValidateNested()
  @Type(() => LocationDto)
  public location: Coordinates;
}

export type CreateOfferServiceDto = CreateOfferDto & {
  author: string;
};
