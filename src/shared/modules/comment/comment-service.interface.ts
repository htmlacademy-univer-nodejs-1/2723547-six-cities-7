import { CreateCommentDto } from './dto/create-comment.dto.js';
import { DocumentType } from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity.js';

export type CreateCommentServiceDto = CreateCommentDto & {
  userId: string;
};

export interface CommentService {
  create(dto: CreateCommentServiceDto): Promise<DocumentType<CommentEntity>>;
  findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]>;
  deleteByOfferId(offerId: string): Promise<number>;
}
