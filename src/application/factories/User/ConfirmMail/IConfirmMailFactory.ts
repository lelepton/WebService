import { IConfirmMailRepoPrismaImpl } from '@infra/repositories_implementation/User/ConfirmMail/IConfirmMailRepoPrismaImpl';
import { IConfirmMailUseCase } from '@application/useCases/User/ConfirmMail/IConfirmMailUseCase';

export class IConfirmMailFactory {
  compose(): IConfirmMailUseCase {
    const iConfirmMailRepo = new IConfirmMailRepoPrismaImpl();
    const iConfirmMailUseCase = new IConfirmMailUseCase(iConfirmMailRepo);

    return iConfirmMailUseCase;
  }
}
