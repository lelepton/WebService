import { InvalidGenerateRefreshTokenErrorResponse } from '@application/handlers/UseCasesResponses/RefreshToken/IGenerateRefreshTokenHandler';
import { RefreshToken } from '@prisma/client';
import { IGenerateRefreshTokenDTO } from './IGenerateRefreshTokenDTO';
import { IRefreshTokenRepository } from '@domain/repositories/IRefreshTokenRepository';

export class IGenerateRefreshTokenUseCase {
  constructor(
    private readonly iRefreshTokenRepository: IRefreshTokenRepository
  ) {}

  async execute({
    user_id,
  }: IGenerateRefreshTokenDTO): Promise<
    InvalidGenerateRefreshTokenErrorResponse | RefreshToken
  > {
    const relatedTokens: RefreshToken | RefreshToken[] | null =
      await this.iRefreshTokenRepository.findRelatedRefreshTokens(
        user_id
      );

    if (relatedTokens) {
      await this.iRefreshTokenRepository.deleteRelatedRefreshTokens(
        user_id
      );
    }

    const refreshToken: RefreshToken | null =
      await this.iRefreshTokenRepository.saveRefreshToken({
        user_id
      });

    if (!refreshToken) return new InvalidGenerateRefreshTokenErrorResponse();

    return refreshToken;
  }
}
