import { inject, injectable } from 'inversify';
import { Types } from 'mongoose';
import { DocumentType, types } from '@typegoose/typegoose';
import { CommentService } from './comment-service.interface.js';
import { CommentEntity } from './comment.entity.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { Component, SortType } from '../../types/index.js';
import { OfferService } from '../offer/index.js';
import { MAX_COMMENTS_COUNT } from './comment.constant.js';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create({
      ...dto,
      date: new Date(),
    });

    await this.updateOfferStatistics(dto.offerId);

    return comment;
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({ offerId })
      .sort({ date: SortType.Down })
      .limit(MAX_COMMENTS_COUNT)
      .populate('userId')
      .exec();
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel.deleteMany({ offerId }).exec();
    await this.updateOfferStatistics(offerId);
    return result.deletedCount;
  }

  private async updateOfferStatistics(offerId: string): Promise<void> {
    if (!Types.ObjectId.isValid(offerId)) {
      return;
    }

    const [statistics] = await this.commentModel.aggregate([
      { $match: { offerId: new Types.ObjectId(offerId) } },
      {
        $group: {
          _id: '$offerId',
          commentCount: { $sum: 1 },
          rating: { $avg: '$rating' },
        },
      },
    ]);

    await this.offerService.updateStatistics(
      offerId,
      statistics?.commentCount ?? 0,
      statistics?.rating ?? 0,
    );
  }
}
