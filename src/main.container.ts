import { Container } from 'inversify';
import { Component } from './shared/types/index.js';
import { Logger } from './shared/libs/logger/index.js';
import { ConsoleLogger } from './shared/libs/logger/index.js';
import { DatabaseClient, MongoDatabaseClient } from './shared/libs/database-client/index.js';

export function createMainContainer() {
  const mainContainer = new Container();

  mainContainer.bind<Logger>(Component.Logger).to(ConsoleLogger).inSingletonScope();
  mainContainer.bind<DatabaseClient>(Component.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();

  return mainContainer;
}
