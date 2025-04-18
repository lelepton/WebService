import { RequestResponseAdapter } from '@adapters/ServerAdapter';

import { IEnsureAccessTokenMiddleware } from '@application/middlewares/IEnsureAccessTokenMiddleware';

import {
  FetchProductsResponse,
  InvalidProductsNotFoundErrorResponse,
} from '@application/handlers/UseCasesResponses/Product/IFetchProductsHandlers';
import { ITokenService } from '@domain/services/ITokenService';
import { IFetchProductsUseCase } from './IFetchProductsUseCase';
import { IFetchProductsDTO } from './IFetchProductsDTO';

export class IFetchProductsController {
  constructor(
    private readonly iFetchProductsUseCase: IFetchProductsUseCase,
    private readonly iTokenService: ITokenService
  ) {}

  async handle(adapter: RequestResponseAdapter) {
    try {
      const iEnsureAccessTokenMiddleware = new IEnsureAccessTokenMiddleware(
        adapter,
        this.iTokenService
      );
      iEnsureAccessTokenMiddleware.ensure();
      const { page }: IFetchProductsDTO = adapter.req
        .params as IFetchProductsDTO;
      const response:
        | FetchProductsResponse
        | InvalidProductsNotFoundErrorResponse =
        await this.iFetchProductsUseCase.execute({
          page,
        });

      if (response instanceof InvalidProductsNotFoundErrorResponse)
        return adapter.res.status(404).send({ 
          message: 'Products Not Found' 
        });

      return adapter.res.status(200).send({ 
        products: response.products 
      });
    } catch (error) {
      return adapter.res.status(500).send({ 
        message: error 
      });
    }
  }
}
