import { IGenerateRefreshTokenUseCase } from './IGenerateRefreshTokenUseCase';
import { InvalidGenerateRefreshTokenErrorResponse } from '@application/handlers/UseCasesResponses/RefreshToken/IGenerateRefreshTokenHandler';
import { IGenerateRefreshTokenDTO } from './IGenerateRefreshTokenDTO';
import { RefreshToken } from '@domain/entities/RefreshToken';
import { IGenerateRefreshTokenFactoryInMemory } from '@application/factories/RefreshToken/GenerateRefreshToken/IGenerateRefreshTokenInMemory';

describe('I generate refresh token use case', () => {
  const refreshTokens: RefreshToken[] = [];
  it('should generate a refresh token successfully', async () => {
    // Arrange
    const iGenerateRefreshTokenFactory = new IGenerateRefreshTokenFactoryInMemory(refreshTokens);
    const sut: IGenerateRefreshTokenUseCase = iGenerateRefreshTokenFactory.compose();
    const userId: string = '56d7ff79-f16d-434b-9183-5b0db27fa4e2';
    const { user_id }: IGenerateRefreshTokenDTO = {
      user_id: userId,
    };

    // Act
    const response:
      | InvalidGenerateRefreshTokenErrorResponse
      | RefreshToken = await sut.execute({ 
        user_id 
    });

    // Assert
    if (response instanceof InvalidGenerateRefreshTokenErrorResponse) {
        return console.log('error generating refresh token');
    }
    expect(response).toHaveProperty('id');
    expect(response).toHaveProperty('public_id');
    expect(response).toHaveProperty('expires_in');
    expect(response.user_id).toBe(userId);
  });
  it('should delete all user related refresh tokens and create a new one', async () => {
    // Arrange
    const iGenerateRefreshTokenFactory = new IGenerateRefreshTokenFactoryInMemory(refreshTokens);
    const sut: IGenerateRefreshTokenUseCase = iGenerateRefreshTokenFactory.compose();
    const userId: string = '56d7ff79-f16d-434b-9183-5b0db27fa4e2';
    const {
        user_id
    }: IGenerateRefreshTokenDTO = {
      user_id: userId,
    };

    // Act
    const response:
      | InvalidGenerateRefreshTokenErrorResponse
      | RefreshToken = await sut.execute({
        user_id
      });
    if (response instanceof InvalidGenerateRefreshTokenErrorResponse) {
        return console.log('error');
    }
    const refreshTokensRelatedToCurrentUser = refreshTokens.filter(
      (refreshToken) => refreshToken.user_id === userId
    );

    // Assert
    expect(refreshTokensRelatedToCurrentUser).toHaveLength(1);
  });
});
