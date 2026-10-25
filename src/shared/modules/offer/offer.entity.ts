import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import {
  Amenity,
  AVAILABLE_AMENITIES_SET,
  AVAILABLE_CITIES_SET,
  AVAILABLE_RENTAL_TYPES_SET,
  City,
  Coordinates,
  RentalType
} from '../../types/index.js';
import { UserEntity } from '../user/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers'
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({ trim: true, required: true })
  public name!: string;

  @prop({ trim: true, required: true })
  public description!: string;

  @prop({ required: true })
  public date!: Date;

  @prop({ required: true, type: () => String, enum: [...AVAILABLE_CITIES_SET] })
  public city!: City;

  @prop({ required: true })
  public preview!: string;

  @prop({ type: () => [String], required: true, default: [] })
  public photos!: string[];

  @prop({ required: true })
  public isPremium!: boolean;

  @prop({ required: true })
  public isFavorite!: boolean;

  @prop({ required: true })
  public rating!: number;

  @prop({ required: true, type: () => String, enum: [...AVAILABLE_RENTAL_TYPES_SET] })
  public type!: RentalType;

  @prop({ required: true })
  public roomsCount!: number;

  @prop({ required: true })
  public guestsCount!: number;

  @prop({ required: true })
  public price!: number;

  @prop({ type: () => [String], required: true, default: [], enum: [...AVAILABLE_AMENITIES_SET] })
  public amenities!: Amenity[];

  @prop({ default: 0 })
  public commentCount!: number;

  @prop({ required: true, ref: UserEntity })
  public author!: Ref<UserEntity>;

  @prop({ required: true, type: () => Object })
  public location!: Coordinates;
}

export const OfferModel = getModelForClass(OfferEntity);
