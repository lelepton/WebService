import { Product } from '@domain/entities/Product';

// Request
export interface ISelectProductDTO extends Pick<Product, 'public_id'> {};

// Response
export class ProductNotFoundErrorResponse extends Error {}
export interface Success {
    product: Product
}
export type ISelectProductResponse =
| ProductNotFoundErrorResponse
| Success