import { inject, injectable } from 'inversify';
import { OfferService, OfferView } from './offer-service.interface.js';
import { City, Component, SortType } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferServiceDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import type { CommentEntity } from '../comment/index.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
  ) {}

  public async create(dto: CreateOfferServiceDto): Promise<DocumentType<OfferEntity>> {
    const { author, ...offerData } = dto;
    const result = await this.offerModel.create({
      ...offerData,
      author,
      favoriteUserIds: [],
    });
    this.logger.info(`New offer created: ${dto.name}`);

    return result;
  }

  public async findById(offerId: string, userId?: string): Promise<OfferView | null> {
    const offer = await this.offerModel.findById(offerId).exec();
    return offer ? this.toView(offer, userId) : null;
  }

  public async find(count?: number, userId?: string): Promise<OfferView[]> {
    const query = this.offerModel.find().sort({ date: SortType.Down });

    if (count !== undefined) {
      query.limit(count);
    }

    const offers = await query.exec();
    return offers.map((offer) => this.toView(offer, userId));
  }

  public async updateById(
    offerId: string,
    dto: UpdateOfferDto,
    userId?: string,
  ): Promise<OfferView | null> {
    const offer = await this.offerModel.findByIdAndUpdate(offerId, dto, { new: true }).exec();
    return offer ? this.toView(offer, userId) : null;
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
    userId?: string,
    count = 3,
  ): Promise<OfferView[]> {
    const offers = await this.offerModel
      .find({ city, isPremium: true })
      .sort({ date: SortType.Down })
      .limit(count)
      .exec();
    return offers.map((offer) => this.toView(offer, userId));
  }

  public async findFavorites(userId: string): Promise<OfferView[]> {
    const offers = await this.offerModel
      .find({ favoriteUserIds: userId })
      .sort({ date: SortType.Down })
      .exec();
    return offers.map((offer) => this.toView(offer, userId));
  }

  public async updateFavoriteStatus(
    offerId: string,
    userId: string,
    isFavorite: boolean,
  ): Promise<OfferView | null> {
    const update = isFavorite
      ? { $addToSet: { favoriteUserIds: userId } }
      : { $pull: { favoriteUserIds: userId } };

    await this.offerModel.findByIdAndUpdate(offerId, update).exec();
    return this.findById(offerId, userId);
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

  private toView(offer: DocumentType<OfferEntity>, userId?: string): OfferView {
    const { favoriteUserIds, ...offerData } = offer.toObject();

    return {
      ...offerData,
      id: offer.id,
      author: String(offer.author),
      isFavorite: Boolean(userId && favoriteUserIds?.includes(userId)),
    } as OfferView;
  }
}
