import { User } from '@domain/entities/User';
import { ILoginRepo } from '@domain/repositories/User/ILoginRepo';
import { IHashService } from '@domain/services/IHashService';
import { ITokenService } from '@domain/services/ITokenService';
import { ILoginDTO } from './ILoginDTO';
import { InvalidUserNotFoundError, InvalidPasswordIsNotEqualError } from '@application/handlers/User/ILoginHandlers';
import { configDotenv } from 'dotenv';
configDotenv();

export class ILoginUseCase {
  constructor(
    private readonly iLoginRepo: ILoginRepo,
    private readonly iHashService: IHashService,
    private readonly iTokenService: ITokenService
  ) {}

  async execute(DTO: ILoginDTO): Promise<object> {
    const user: User | null = await this.iLoginRepo.findUser(DTO.email);
    if (!user) return new InvalidUserNotFoundError();

    const isPasswordEqual: boolean = await this.iHashService.compare(
      DTO.password,
      user.password
    );
    if (!isPasswordEqual) return new InvalidPasswordIsNotEqualError();

    const accessToken: string = this.iTokenService.sign({
      payload: {
        sub: user.public_id,
      },
      secret_key: process.env.SECRET_KEY as string,
      options: {
        expiresIn: '30m',
      },
    });

    return {
      user: {
        public_id: user.public_id,
        name: user.name,
        surname: user.surname
      },
      accessToken: accessToken
    };
  }
}
