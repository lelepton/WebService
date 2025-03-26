import { User } from '../../../entities/User';
import { ICreateUserDTO } from './../../../../application/useCases/User/CreateUser/ICreateUserDTO';

export interface ICreateUserRepo {
    findUser<T>(param: T): Promise<boolean>;
    save(user: ICreateUserDTO): Promise<User>; 
}

