import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import {
  BaseController,
  DocumentExistsMiddleware,
  HttpMethod,
  RequestBody,
  RequestParams,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware
} from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component, City } from '../../types/index.js';
import { OfferService } from './offer-service.interface.js';
import { CommentService } from '../comment/index.js';
import { CommentRdo } from '../comment/index.js';
import { fillDTO } from '../../helpers/index.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { CreateOfferRequest } from './create-offer-request.type.js';
import { UpdateOfferRequest } from './update-offer-request.type.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';

const DEFAULT_OFFER_COUNT = 60;

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService,
  ) {
    super(logger);
    this.logger.info('Register routes for OfferController…');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateOfferDto)],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Put,
      handler: this.update,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({ path: '/premium/:city', method: HttpMethod.Get, handler: this.premium });
  }

  public async index(
    { query }: Request<RequestParams, RequestBody, unknown, { count?: string }>,
    res: Response,
  ): Promise<void> {
    const parsedCount = Number.parseInt(query.count ?? '', 10);
    const offers = await this.offerService.find(Number.isNaN(parsedCount) ? DEFAULT_OFFER_COUNT : parsedCount);
    const responseData = fillDTO(OfferRdo, offers);
    this.ok(res, responseData);
  }

  public async show(
    { params }: Request<RequestParams, RequestBody, unknown>,
    res: Response,
  ): Promise<void> {
    const offer = await this.offerService.findById(params.offerId as string);
    const responseData = fillDTO(OfferRdo, offer);
    this.ok(res, responseData);
  }

  public async create(
    { body }: CreateOfferRequest,
    res: Response,
  ): Promise<void> {
    const result = await this.offerService.create(body);
    const responseData = fillDTO(OfferRdo, result);
    this.created(res, responseData);
  }

  public async update(
    { params, body }: UpdateOfferRequest,
    res: Response,
  ): Promise<void> {
    const offer = await this.offerService.updateById(params.offerId as string, body);
    const responseData = fillDTO(OfferRdo, offer);
    this.ok(res, responseData);
  }

  public async delete(
    { params }: Request<RequestParams, RequestBody, unknown>,
    res: Response,
  ): Promise<void> {
    const offer = await this.offerService.deleteById(params.offerId as string);
    this.noContent(res, offer);
  }

  public async premium(
    { params }: Request<RequestParams, RequestBody, unknown>,
    res: Response,
  ): Promise<void> {
    const offers = await this.offerService.findPremiumByCity(params.city as City);
    const responseData = fillDTO(OfferRdo, offers);
    this.ok(res, responseData);
  }

  public async getComments(
    { params }: Request<RequestParams, RequestBody, unknown>,
    res: Response,
  ): Promise<void> {
    const comments = await this.commentService.findByOfferId(params.offerId as string);
    const responseData = fillDTO(CommentRdo, comments);
    this.ok(res, responseData);
  }
}
