import { IRegisterDTO } from '@application/useCases/User/Register/IRegisterDTO';
import { User } from '@domain/entities/User';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { IUserRepositoryPrismaImpl } from '@infra/repositories/User/IUserRepositoryPrismaImpl';

class IUserDecorator implements IUserRepository {
  constructor(
    private readonly decoratee: IUserRepository
  ) {}

  async findUserByEmail({
    email
  }: Pick<User, 'email'>): Promise<User | null> {
    return await this.decoratee.findUserByEmail({
      email
    });
  }

  async saveUser({
    icon_id,
    name,
    surname,
    email,
    description,
    role,
    password,
  }: IRegisterDTO): Promise<User> {
    return await this.decoratee.saveUser({
      icon_id,
      name,
      surname,
      email,
      description,
      role,
      password,
    });
  }

  async findUserById({ 
    public_id
  }: Pick<User, 'public_id'>): Promise<User | null> {
    return await this.decoratee.findUserById({
      public_id
    });
  }

  async trackUserActivity({
    email
  }: Pick<User, 'email'>): Promise<void> {
      await this.decoratee.trackUserActivity({
        email
      });
  }
}

const decoratee = new IUserRepositoryPrismaImpl();
const iUserDecorator = new IUserDecorator(decoratee);

export { iUserDecorator };