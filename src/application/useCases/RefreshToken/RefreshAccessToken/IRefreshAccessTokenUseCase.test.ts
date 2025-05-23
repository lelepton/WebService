import dayjs from 'dayjs';
import { User } from '@domain/entities/User';
import { IRefreshAccessTokenUseCase } from './IRefreshAccessTokenUseCase';
import { IRefreshAccessTokenFactoryInMemory } from '@application/factories/RefreshToken/RefreshAccessToken/IRefreshAccessTokenFactoryInMemory';
import { RefreshToken } from '@domain/entities/RefreshToken';
import { IRefreshAccessTokenDTO, IRefreshAccessTokenResponse, RefreshTokenNotFoundErrorResponse, RefreshTokenUserNotFoundErrorResponse } from './IRefreshAccessTokenDTO';
import { configDotenv } from 'dotenv';
configDotenv();

const users: User[] = [];
const user: User = {
  id: users.length + 1,
  public_id: 'a795c246-ca3b-46d0-8f66-b7ffef395b42',
  icon_id: '',
  name: 'João',
  surname: 'Pugliesi',
  email: 'mrlanguages62@gmail.com',
  description: '',
  password: '$2b$10$GX73JFHmigssj00i5mES9uak392P5wSrS6caNFaQ0ybZkm2TBuBkK',
  role: 'Buyer',
  is_email_verified: false,
  created_at: new Date(),
  last_login_at: new Date(),
  email_verified_at: null,
};
const user2: User = {
  id: users.length + 1,
  public_id: 'a795c246-ca3b-46d0-8f66-b7ffef395b43',
  icon_id: '',
  name: 'João',
  surname: 'Pugliesi',
  email: 'mrlanguages62@gmail.com',
  description: '',
  password: '$2b$10$GX73JFHmigssj00i5mES9uak392P5wSrS6caNFaQ0ybZkm2TBuBkK',
  role: 'Buyer',
  is_email_verified: false,
  created_at: new Date(),
  last_login_at: new Date(),
  email_verified_at: null,
};
users.push(user);
users.push(user2);

const refreshTokens: RefreshToken[] = [];
const expiresIn = dayjs().add(10, 'days').unix();
const refreshToken: RefreshToken = {
  id: refreshTokens.length + 1,
  public_id: 'a09d22d2-2464-42e3-827c-fe73626ff8b6',
  expires_in: expiresIn,
  owner_id: 'a795c246-ca3b-46d0-8f66-b7ffef395b42',
};

const expiresIn2 = dayjs().add(1, 'second').unix();

const refreshToken2: RefreshToken = {
  id: refreshTokens.length + 1,
  public_id: 'a09d22d2-2464-42e3-827c-fe73626ff8b8',
  expires_in: expiresIn2,
  owner_id: 'a795c246-ca3b-46d0-8f66-b7ffef395b43',
};
refreshTokens.push(refreshToken);
refreshTokens.push(refreshToken2);

describe('I refresh access token use case', () => {
  it('should fail because refresh token does not exist', async () => {
    // Arrange
    const refreshTokensSpliced = refreshTokens.toSpliced(0);
    const iRefreshAccessTokenFactoryInMemory =
      new IRefreshAccessTokenFactoryInMemory(users, refreshTokensSpliced);
    const sut: IRefreshAccessTokenUseCase =
      iRefreshAccessTokenFactoryInMemory.compose();
    // Act
    const { public_id }: IRefreshAccessTokenDTO = {
      public_id: 'a09d22d2-2464-42e3-827c-fe73626ff8b6',
    };
    const response: IRefreshAccessTokenResponse = await sut.execute({
      public_id,
    });
    // Assert
    expect(response).not.toBeInstanceOf(
      RefreshTokenUserNotFoundErrorResponse
    );
    expect(response).toBeInstanceOf(RefreshTokenNotFoundErrorResponse);
  });

  it('should fail because user does not exist', async () => {
    // Arrange
    const usersSpliced = users.toSpliced(0);
    const iRefreshAccessTokenFactoryInMemory =
      new IRefreshAccessTokenFactoryInMemory(usersSpliced, refreshTokens);
    const sut: IRefreshAccessTokenUseCase =
      iRefreshAccessTokenFactoryInMemory.compose();
    // Act
    const { public_id }: IRefreshAccessTokenDTO = {
      public_id: 'a09d22d2-2464-42e3-827c-fe73626ff8b6',
    };
    const response: IRefreshAccessTokenResponse = await sut.execute({
      public_id,
    });
    // Assert
    expect(response).toBeInstanceOf(
      RefreshTokenUserNotFoundErrorResponse
    );
    expect(response).not.toBeInstanceOf(
      RefreshTokenNotFoundErrorResponse
    );
  });

  it('should refresh the access token successfully', async () => {
    // Arrange
    const iRefreshAccessTokenFactoryInMemory =
      new IRefreshAccessTokenFactoryInMemory(users, refreshTokens);
    const sut: IRefreshAccessTokenUseCase =
      iRefreshAccessTokenFactoryInMemory.compose();
    // Act
    const { public_id }: IRefreshAccessTokenDTO = {
      public_id: 'a09d22d2-2464-42e3-827c-fe73626ff8b6',
    };
    const response: IRefreshAccessTokenResponse = await sut.execute({
      public_id,
    });
    // Assert
    expect(response).not.toBeInstanceOf(
      RefreshTokenUserNotFoundErrorResponse
    );
    expect(response).not.toBeInstanceOf(
      RefreshTokenNotFoundErrorResponse
    );
    expect(response).toHaveProperty('access_token');
  });

  it('should refresh the access token and renovate the refresh token successfully', async () => {
    // Arrange
    const iRefreshAccessTokenFactoryInMemory =
      new IRefreshAccessTokenFactoryInMemory(users, refreshTokens);
    const sut: IRefreshAccessTokenUseCase =
      iRefreshAccessTokenFactoryInMemory.compose();
    // Act
    const { public_id }: IRefreshAccessTokenDTO = {
      public_id: 'a09d22d2-2464-42e3-827c-fe73626ff8b8',
    };
    const response: IRefreshAccessTokenResponse = await sut.execute({
      public_id,
    });

    // Assert
    expect(response).not.toBeInstanceOf(
      RefreshTokenUserNotFoundErrorResponse
    );
    expect(response).not.toBeInstanceOf(
      RefreshTokenNotFoundErrorResponse
    );
    expect(response).toHaveProperty('access_token');
  });
});
