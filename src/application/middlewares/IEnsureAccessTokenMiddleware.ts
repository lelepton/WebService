import { ITokenService } from '@domain/services/ITokenService';
import { RequestResponseAdapter } from '@adapters/ServerAdapter';
import { configDotenv } from 'dotenv';
configDotenv();

export class IEnsureAccessTokenMiddleware {
  private readonly secret_key: string;

  constructor(
    private readonly adapter: RequestResponseAdapter,
    private readonly iTokenService: ITokenService
  ) {
    this.secret_key = process.env.SECRET_KEY as string;
  }

  ensure() {
    const authToken = this.adapter.req.headers?.authorization;

    if (!authToken) {
      return this.adapter.res.status(401).send({ message: 'Token is missing' });
    }

    const [, token] = authToken.split(' ');

    try {
      this.iTokenService.verify({
        token: token,
        secret_key: this.secret_key,
      });
    } catch (error) {
      return this.adapter.res.status(401).send({ message: 'Token invalid' });
    }
  }
}
