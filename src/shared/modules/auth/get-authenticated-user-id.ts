import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../../libs/rest/index.js';
import { TokenPayload } from './types/token-payload.type.js';

export function getAuthenticatedUserId(tokenPayload?: TokenPayload): string {
  if (!tokenPayload) {
    throw new HttpError(StatusCodes.UNAUTHORIZED, 'Unauthorized', 'AuthService');
  }

  return tokenPayload.id;
}
