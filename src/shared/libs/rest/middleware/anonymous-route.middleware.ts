import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from './middleware.interface.js';
import { HttpError } from '../errors/index.js';

export class AnonymousRouteMiddleware implements Middleware {
  public execute(req: Request, _res: Response, next: NextFunction): void {
    if (req.tokenPayload) {
      throw new HttpError(StatusCodes.FORBIDDEN, 'This route is only available to anonymous clients', 'AnonymousRouteMiddleware');
    }

    next();
  }
}
