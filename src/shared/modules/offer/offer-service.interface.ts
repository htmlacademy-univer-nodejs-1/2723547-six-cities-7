import { CreateOfferServiceDto } from './dto/create-offer.dto.js';
import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { City } from '../../types/index.js';

export type OfferView = Omit<OfferEntity, 'favoriteUserIds'> & {
  id: string;
  isFavorite: boolean;
  author: string;
};

export interface OfferService {
  create(dto: CreateOfferServiceDto): Promise<DocumentType<OfferEntity>>;
  findById(offerId: string, userId?: string): Promise<OfferView | null>;
  find(count?: number, userId?: string): Promise<OfferView[]>;
  updateById(offerId: string, dto: UpdateOfferDto, userId?: string): Promise<OfferView | null>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  findPremiumByCity(city: City, userId?: string, count?: number): Promise<OfferView[]>;
  findFavorites(userId: string): Promise<OfferView[]>;
  updateFavoriteStatus(offerId: string, userId: string, isFavorite: boolean): Promise<OfferView | null>;
  updateStatistics(offerId: string, commentCount: number, rating: number): Promise<DocumentType<OfferEntity> | null>;
  exists(offerId: string): Promise<boolean>;
}
