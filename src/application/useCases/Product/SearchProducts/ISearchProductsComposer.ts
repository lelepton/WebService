import { ISearchProductsFactory } from "@application/factories/Product/ISearchProducts/ISearchProductsFactory";
import { ISearchProductsController } from "./ISearchProductsController";
import { ITokenServiceJWTImpl } from "@infra/services_implementation/ITokenServiceJWTImpl";

const iFactory = new ISearchProductsFactory();
const iUseCase = iFactory.compose();
const iTokenService = new ITokenServiceJWTImpl();
const iController = new ISearchProductsController(iUseCase, iTokenService);
const iSearchProducts: ISearchProductsController = iController;

export { iSearchProducts };