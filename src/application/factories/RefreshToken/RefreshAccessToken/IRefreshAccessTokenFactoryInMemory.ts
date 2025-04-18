import { User } from '@domain/entities/User';
import { IGenerateRefreshTokenFactoryInMemory } from '@application/factories/RefreshToken/GenerateRefreshToken/IGenerateRefreshTokenInMemory';
import { ITokenServiceJWTImpl } from '@infra/services_implementation/ITokenServiceJWTImpl';
import { IRefreshAccessTokenUseCase } from '@application/useCases/RefreshToken/RefreshAccessToken/IRefreshAccessTokenUseCase';
import { RefreshToken } from '@domain/entities/RefreshToken';
import { IRefreshTokenRepositoryInMemoryImpl } from '@infra/repositories_implementation/RefreshToken/IRefreshTokenRepositoryInMemoryImpl';
import { IUserRepositoryInMemoryImpl } from '@infra/repositories_implementation/User/IUserRepositoryInMemoryImpl';
import { IHashServiceBCryptImpl } from '@infra/services_implementation/IHashServiceBCryptImpl';

export class IRefreshAccessTokenFactoryInMemory {

  constructor(
    private readonly users: User[],
    private readonly refreshTokens: RefreshToken[]
  ) {}

  compose(): IRefreshAccessTokenUseCase {
    const iHashService = new IHashServiceBCryptImpl();
    const iRefreshTokenRepository = new IRefreshTokenRepositoryInMemoryImpl(this.refreshTokens);
    const iUserRepository = new IUserRepositoryInMemoryImpl(this.users, iHashService);
    const iTokenService = new ITokenServiceJWTImpl();
    const iGenerateRefreshTokenFactoryInMemory = new IGenerateRefreshTokenFactoryInMemory(this.refreshTokens);
    const iGenerateRefreshTokenUseCase = iGenerateRefreshTokenFactoryInMemory.compose()

    return new IRefreshAccessTokenUseCase(
      iRefreshTokenRepository,
      iUserRepository,
      iGenerateRefreshTokenUseCase,
      iTokenService
    );;
  }
}