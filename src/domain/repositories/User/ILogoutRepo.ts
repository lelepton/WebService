import { RefreshToken } from "@domain/entities/RefreshToken";

export interface ILogoutRepo {
    findRefreshToken<T>(param: T): Promise<RefreshToken | null>;
    deleteRelatedRefreshTokens<T>(param: T): Promise<void>;
}