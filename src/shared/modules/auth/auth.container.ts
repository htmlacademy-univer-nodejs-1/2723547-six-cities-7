import { Container } from 'inversify';
import { AuthService } from './auth-service.interface.js';
import { DefaultAuthService } from './default-auth.service.js';
import { Component } from '../../types/index.js';

export function createAuthContainer() {
  const authContainer = new Container();
  authContainer
    .bind<AuthService>(Component.AuthService)
    .to(DefaultAuthService)
    .inSingletonScope();
  return authContainer;
}
