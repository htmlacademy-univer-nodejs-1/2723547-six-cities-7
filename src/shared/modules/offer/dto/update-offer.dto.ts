import {
  IsArray,
  ArrayMaxSize,
  ArrayMinSize,
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
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
import { UpdateOfferMessages } from './update-offer.messages.js';
import { LocationDto } from './location.dto.js';

export class UpdateOfferDto {
  @IsOptional()
  @IsString({ message: UpdateOfferMessages.name.invalidFormat })
  @Length(10, 100, { message: UpdateOfferMessages.name.lengthField })
  public name?: string;

  @IsOptional()
  @IsString({ message: UpdateOfferMessages.description.invalidFormat })
  @Length(20, 1024, { message: UpdateOfferMessages.description.lengthField })
  public description?: string;

  @IsOptional()
  @IsDateString({}, { message: UpdateOfferMessages.date.invalidFormat })
  public date?: Date;

  @IsOptional()
  @IsIn([...AVAILABLE_CITIES_SET], { message: UpdateOfferMessages.city.invalid })
  public city?: City;

  @IsOptional()
  @IsUrl({}, { message: UpdateOfferMessages.preview.invalidUrl })
  public preview?: string;

  @IsOptional()
  @IsArray({ message: UpdateOfferMessages.photos.invalidFormat })
  @ArrayMinSize(6, { message: UpdateOfferMessages.photos.countField })
  @ArrayMaxSize(6, { message: UpdateOfferMessages.photos.countField })
  @IsUrl({}, { each: true, message: UpdateOfferMessages.photos.invalidFormat })
  public photos?: string[];

  @IsOptional()
  @IsBoolean({ message: UpdateOfferMessages.isPremium.invalidFormat })
  public isPremium?: boolean;

  @IsOptional()
  @Min(1, { message: UpdateOfferMessages.rating.minValue })
  @Max(5, { message: UpdateOfferMessages.rating.maxValue })
  public rating?: number;

  @IsOptional()
  @IsIn([...AVAILABLE_RENTAL_TYPES_SET], { message: UpdateOfferMessages.type.invalid })
  public type?: RentalType;

  @IsOptional()
  @IsInt({ message: UpdateOfferMessages.roomsCount.invalidFormat })
  @Min(1, { message: UpdateOfferMessages.roomsCount.minValue })
  @Max(8, { message: UpdateOfferMessages.roomsCount.maxValue })
  public roomsCount?: number;

  @IsOptional()
  @IsInt({ message: UpdateOfferMessages.guestsCount.invalidFormat })
  @Min(1, { message: UpdateOfferMessages.guestsCount.minValue })
  @Max(10, { message: UpdateOfferMessages.guestsCount.maxValue })
  public guestsCount?: number;

  @IsOptional()
  @IsInt({ message: UpdateOfferMessages.price.invalidFormat })
  @Min(100, { message: UpdateOfferMessages.price.minValue })
  @Max(100000, { message: UpdateOfferMessages.price.maxValue })
  public price?: number;

  @IsOptional()
  @IsArray({ message: UpdateOfferMessages.amenities.invalidFormat })
  @IsIn([...AVAILABLE_AMENITIES_SET], { each: true, message: UpdateOfferMessages.amenities.invalidItem })
  public amenities?: Amenity[];

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  public location?: Coordinates;
}
