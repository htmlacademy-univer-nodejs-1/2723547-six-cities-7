import type { TokenPayload } from './src/shared/modules/auth/types/token-payload.type.js';

declare global {
  namespace Express {
    interface Request {
      tokenPayload?: TokenPayload;
    }
  }
}

export {};
