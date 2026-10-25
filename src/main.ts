#!/usr/bin/env node
import 'reflect-metadata';
import { Container } from 'inversify';
import { CLIApplication, GenerateCommand, HelpCommand, ImportCommand, VersionCommand } from './cli/index.js';
import { Component } from './shared/types/index.js';
import { DatabaseClient } from './shared/libs/database-client/index.js';
import { createMainContainer } from './main.container.js';
import { createUserContainer } from './shared/modules/user/index.js';
import { UserService } from './shared/modules/user/user-service.interface.js';
import { createOfferContainer } from './shared/modules/offer/index.js';
import { OfferService } from './shared/modules/offer/index.js';

function bootstrap() {
  const appContainer = Container.merge(
    createMainContainer(),
    createUserContainer(),
    createOfferContainer(),
  );

  const cliApplication = new CLIApplication();
  cliApplication.registerCommands([
    new HelpCommand(),
    new VersionCommand(),
    new ImportCommand(
      appContainer.get<UserService>(Component.UserService),
      appContainer.get<OfferService>(Component.OfferService),
      appContainer.get<DatabaseClient>(Component.DatabaseClient),
    ),
    new GenerateCommand(),
  ]);

  cliApplication.processCommand(process.argv);
}

bootstrap();
