import { NextFunction, Request, Response } from 'express';
import multer, { diskStorage } from 'multer';
import { extension } from 'mime-types';
import { nanoid } from 'nanoid';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from './middleware.interface.js';
import { HttpError } from '../errors/index.js';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png'];

export class UploadFileMiddleware implements Middleware {
  constructor(
    private readonly uploadDirectory: string,
    private readonly fieldName: string,
  ) {}

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const storage = diskStorage({
      destination: this.uploadDirectory,
      filename: (_req, file, callback) => {
        const fileExtension = extension(file.mimetype);
        const filename = nanoid();
        callback(null, `${filename}.${fileExtension}`);
      }
    });

    const uploadSingleFileMiddleware = multer({
      storage,
      fileFilter: (_req, file, callback) => {
        if (! ALLOWED_MIME_TYPES.includes(file.mimetype)) {
          callback(new HttpError(
            StatusCodes.BAD_REQUEST,
            `Only ${ALLOWED_MIME_TYPES.join(', ')} files are allowed.`,
            'UploadFileMiddleware'
          ));
          return;
        }

        callback(null, true);
      },
    })
      .single(this.fieldName);

    uploadSingleFileMiddleware(req, res, next);
  }
}
