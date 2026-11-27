import { NextFunction, Request, Response } from 'express';
import { jwtVerify } from 'jose';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from './middleware.interface.js';
import { HttpError } from '../errors/index.js';
import { TokenPayload } from '../../../modules/auth/index.js';

function isTokenPayload(payload: unknown): payload is TokenPayload {
  return (
    typeof payload === 'object'
    && payload !== null
    && 'id' in payload
    && typeof payload.id === 'string'
    && /^[a-f\d]{24}$/i.test(payload.id)
    && 'email' in payload
    && typeof payload.email === 'string'
  );
}

export class ParseTokenMiddleware implements Middleware {
  constructor(private readonly jwtSecret: string) {}

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const authorization = req.headers.authorization;

    if (!authorization) {
      next();
      return;
    }

    const match = /^Bearer\s+(\S+)$/i.exec(authorization);

    if (!match) {
      return next(new HttpError(StatusCodes.UNAUTHORIZED, 'Invalid authorization header', 'ParseTokenMiddleware'));
    }

    try {
      const { payload } = await jwtVerify(match[1], new TextEncoder().encode(this.jwtSecret));

      if (isTokenPayload(payload)) {
        req.tokenPayload = payload;
        return next();
      }

    } catch {
      return next(new HttpError(StatusCodes.UNAUTHORIZED, 'Invalid token', 'ParseTokenMiddleware'));
    }
  }
}
