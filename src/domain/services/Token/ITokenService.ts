import { Token } from "./Token";


export interface ITokenService {
  sign(params: Token): string;
  verify(params: Token): string | object;
  decode(token: string, options: object): any;
}
