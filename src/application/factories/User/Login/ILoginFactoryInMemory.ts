import { User } from '@domain/entities/User';
import { RefreshToken } from '@domain/entities/RefreshToken';
import { ITokenServiceJWTImpl } from '@infra/services_implementation/ITokenServiceJWTImpl';
import { ILoginUseCase } from '@application/useCases/User/Login/ILoginUseCase';
import { IGenerateRefreshTokenFactoryInMemory } from '@application/factories/RefreshToken/GenerateRefreshToken/IGenerateRefreshTokenInMemory';
import { IHashServiceBCryptImpl } from '@infra/services_implementation/IHashServiceBCryptImpl';
import { IUserRepositoryInMemoryImpl } from '@infra/repositories_implementation/User/IUserRepositoryInMemoryImpl';

export class ILoginFactoryInMemory {

  constructor(
    private readonly users: User[],
    private readonly refreshTokens: RefreshToken[]
  ) {}

  compose(): ILoginUseCase {
    const iHashService = new IHashServiceBCryptImpl();
    const iUserRepository = new IUserRepositoryInMemoryImpl(this.users, iHashService);
    const iTokenService = new ITokenServiceJWTImpl();
    const iGenerateRefreshTokenFactoryInMemory = new IGenerateRefreshTokenFactoryInMemory(this.refreshTokens);
    const iGenerateRefreshTokenUseCase = iGenerateRefreshTokenFactoryInMemory.compose();

    return new ILoginUseCase(
      iUserRepository,
      iHashService,
      iTokenService,
      iGenerateRefreshTokenUseCase
    );
  }
}
