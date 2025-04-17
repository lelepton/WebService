import { iSelectProductsDecorator } from '@application/decorators/Product/ISelectProductsDecorator';
import { ISelectProductsUseCase } from '@application/useCases/Product/SelectProducts/ISelectProductsUseCase';
import { ICacheServiceRedisImpl } from '@infra/services_implementation/CacheService/ICacheServiceRedisImpl';

export class ISelectProductsFactory {
    compose(): ISelectProductsUseCase {
        const iCacheServiceRedisImpl = new ICacheServiceRedisImpl();
        return new ISelectProductsUseCase(iSelectProductsDecorator, iCacheServiceRedisImpl);
    }
}