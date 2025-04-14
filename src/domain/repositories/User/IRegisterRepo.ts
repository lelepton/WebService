import { IRegisterDTO } from '@application/useCases/User/Register/IRegisterDTO';
import { User } from '@domain/entities/User';

export interface IRegisterRepo {
    findUser<T>(param: T): Promise<boolean>;
    saveUser(DTO: IRegisterDTO): Promise<User>; 
}

