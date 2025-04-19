import { prisma } from '@infra/db/Prisma';
import { RefreshToken } from '@domain/entities/RefreshToken';
import { IRefreshTokenRepository } from '@domain/repositories/IRefreshTokenRepository';
import { IGenerateRefreshTokenDTO } from '@application/useCases/RefreshToken/GenerateRefreshToken/IGenerateRefreshTokenDTO';
import dayjs from 'dayjs';
import { randomUUID } from 'crypto';

export class IRefreshTokenRepositoryPrismaImpl implements IRefreshTokenRepository {
  async findRelatedRefreshTokens<T>(
    param: T
  ): Promise<RefreshToken | RefreshToken[] | null> {
    const refreshTokens: RefreshToken | RefreshToken[] | null =
      await prisma.refreshToken.findMany({
        where: {
          user_id: param as string,
        },
      });

    if (!refreshTokens) return null;

    return refreshTokens;
  }

  async findRefreshToken<T>(param: T): Promise<RefreshToken | null> {
    const refreshToken: RefreshToken | null =
      await prisma.refreshToken.findFirst({
        where: {
          public_id: param as string,
        },
      });

    if (!refreshToken) return null;

    return refreshToken;
  }

  async deleteRelatedRefreshTokens<T>(param: T): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: {
        user_id: param as string,
      },
    });
  }
  async saveRefreshToken(
    { 
      user_id 
    }: IGenerateRefreshTokenDTO
  ): Promise<RefreshToken | null> {
    const expiresIn = dayjs().add(14, 'days').unix();
    const refreshToken: RefreshToken | null = await prisma.refreshToken.create({
      data: {
        public_id: randomUUID(),
        user_id: user_id,
        expires_in: expiresIn,
      },
    });

    if (!refreshToken) return null;

    return refreshToken;
  }
}
