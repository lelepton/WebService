import { User } from '@domain/entities/User';
import { IGenerateRefreshTokenDTO } from '@application/useCases/RefreshToken/GenerateRefreshToken/IGenerateRefreshTokenDTO';
import { IGenerateRefreshTokenUseCase } from '@application/useCases/RefreshToken/GenerateRefreshToken/IGenerateRefreshTokenUseCase';
import { IHashService } from '@domain/services/IHashService';
import { ITokenService } from '@domain/services/ITokenService';
import { ILoginDTO } from './ILoginDTO';
import {
  InvalidUserNotFoundErrorResponse,
  InvalidPasswordIsNotEqualErrorResponse,
  LoginResponse,
} from '@application/handlers/UseCasesResponses/User/ILoginHandlers';
import { RefreshToken } from '@domain/entities/RefreshToken';
import { InvalidGenerateRefreshTokenErrorResponse } from '@application/handlers/UseCasesResponses/RefreshToken/IGenerateRefreshTokenHandler';
import { IUserRepository } from '@domain/repositories/IUserRepository';

export class ILoginUseCase {
  constructor(
    private readonly iUserRepository: IUserRepository,
    private readonly iHashService: IHashService,
    private readonly iTokenService: ITokenService,
    private readonly iGenerateRefreshTokenUseCase: IGenerateRefreshTokenUseCase
  ) {}

  async execute(
    {
      email,
      password
    }: ILoginDTO
  ): Promise<
    | InvalidUserNotFoundErrorResponse
    | InvalidPasswordIsNotEqualErrorResponse
    | InvalidGenerateRefreshTokenErrorResponse
    | LoginResponse
  > {
    const user: User | null = await this.iUserRepository.findUser(email);
    if (!user) return new InvalidUserNotFoundErrorResponse();

    const isPasswordEqual: boolean = await this.iHashService.compare(
      password,
      user.password
    );
    if (!isPasswordEqual) return new InvalidPasswordIsNotEqualErrorResponse();
    
    const { public_id, name, surname, role, is_active } = user;

    const accessToken: string = this.iTokenService.sign({
      payload: {
        content: public_id
      },
      secret_key: process.env.SECRET_KEY as string,
      options: {
        expiresIn: '1h',
      },
    });

    const iGenerateRefreshTokenDTO: IGenerateRefreshTokenDTO = {
      user_id: public_id
    };
    
    const refreshToken: InvalidGenerateRefreshTokenErrorResponse | RefreshToken =
      await this.iGenerateRefreshTokenUseCase.execute(iGenerateRefreshTokenDTO);

    if (refreshToken instanceof InvalidGenerateRefreshTokenErrorResponse)
      return new InvalidGenerateRefreshTokenErrorResponse();
    
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        name: name,
        surname: surname,
        email: email,
        role: role,
        is_active: is_active,
      }
    };
  }
}
