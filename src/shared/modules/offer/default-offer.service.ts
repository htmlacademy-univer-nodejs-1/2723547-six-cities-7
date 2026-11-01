import { inject, injectable } from 'inversify';
import { OfferService } from './offer-service.interface.js';
import { City, Component, SortType } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import type { CommentEntity } from '../comment/index.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.name}`);

    return result;
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(offerId).exec();
  }

  public async find(count?: number): Promise<DocumentType<OfferEntity>[]> {
    const query = this.offerModel.find().sort({ date: SortType.Down });

    if (count !== undefined) {
      query.limit(count);
    }

    return query.exec();
  }

  public async updateById(
    offerId: string,
    dto: UpdateOfferDto,
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(offerId, dto, { new: true }).exec();
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    const offer = await this.offerModel.findByIdAndDelete(offerId).exec();

    if (offer) {
      await this.commentModel.deleteMany({ offerId }).exec();
    }

    return offer;
  }

  public async findPremiumByCity(
    city: City,
    count = 3,
  ): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({ city, isPremium: true })
      .sort({ date: SortType.Down })
      .limit(count)
      .exec();
  }

  public async findFavorites(): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find({ isFavorite: true }).sort({ date: SortType.Down }).exec();
  }

  public async updateFavoriteStatus(
    offerId: string,
    isFavorite: boolean,
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, { isFavorite }, { new: true })
      .exec();
  }

  public async updateStatistics(
    offerId: string,
    commentCount: number,
    rating: number,
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, { commentCount, rating }, { new: true })
      .exec();
  }

  public async exists(offerId: string): Promise<boolean> {
    return (await this.offerModel.exists({ _id: offerId })) !== null;
  }
}
