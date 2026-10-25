import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { createOffer, getErrorMessage, getMongoURI } from '../../shared/helpers/index.js';
import { UserService } from '../../shared/modules/user/user-service.interface.js';
import { OfferService } from '../../shared/modules/offer/index.js';
import { DatabaseClient } from '../../shared/libs/database-client/index.js';
import { DEFAULT_DB_PORT } from './command.constant.js';
import { Offer } from '../../shared/types/index.js';

export class ImportCommand implements Command {
  private userService: UserService;
  private offerService: OfferService;
  private databaseClient: DatabaseClient;
  private salt: string;

  constructor(
    userService: UserService,
    offerService: OfferService,
    databaseClient: DatabaseClient,
  ) {
    this.userService = userService;
    this.offerService = offerService;
    this.databaseClient = databaseClient;

    this.onImportedLine = this.onImportedLine.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);
  }

  private async onImportedLine(
    line: string,
    resolve: () => void,
    reject: (error: unknown) => void,
  ) {
    try {
      const offer = createOffer(line);
      await this.saveOffer(offer);
      resolve();
    } catch (error) {
      reject(error);
    }
  }

  private onCompleteImport(count: number) {
    console.info(`${count} rows imported.`);
  }

  private async saveOffer(offer: Offer) {
    const user = await this.userService.findOrCreate(offer.author, this.salt);

    await this.offerService.create({
      name: offer.name,
      description: offer.description,
      date: new Date(offer.date),
      city: offer.city,
      preview: offer.preview,
      photos: offer.photos,
      isPremium: offer.isPremium,
      isFavorite: offer.isFavorite,
      rating: offer.rating,
      type: offer.type,
      roomsCount: offer.roomsCount,
      guestsCount: offer.guestsCount,
      price: offer.price,
      amenities: offer.amenities,
      author: user.id,
      location: offer.location,
    });
  }

  public getName(): string {
    return '--import';
  }

  public async execute(filename: string, login: string, password: string, host: string, dbname: string, salt: string): Promise<void> {
    const uri = getMongoURI(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;

    await this.databaseClient.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onImportedLine);
    fileReader.on('end', this.onCompleteImport);

    try {
      await fileReader.read();
    } catch (error) {
      console.error(`Can't import data from file: ${filename}`);
      console.error(getErrorMessage(error));
    } finally {
      await this.databaseClient.disconnect();
    }
  }
}
