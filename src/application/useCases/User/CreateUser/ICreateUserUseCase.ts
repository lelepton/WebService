import { User } from "../../../../domain/entities/User";
import { IHashService } from "../../../../domain/services/IHashService";
import { ICreateUserRepo } from "../../../../domain/repositories/User/ICreateUserRepo";
import { IMailProvider } from "../../../../domain/providers/repositories/Mail/IMailProvider";
import { ICreateUserDTO } from "./ICreateUserDTO";

export class ICreateUserUseCase {
  constructor(
    private readonly iCreateUserRepo: ICreateUserRepo,
    private readonly iMailProvider: IMailProvider,
    private readonly iHashService: IHashService
  ) {}

  async execute(DTO: ICreateUserDTO): Promise<boolean | User> {
    const isUser: boolean = await this.iCreateUserRepo.findUser(DTO.email);

    if (isUser) {
      return false;
    }

    const user: User = await this.iCreateUserRepo.save(
      DTO,
      this.iHashService
    );

    await this.iMailProvider.sendMail({
      to: {
        email: user.email,
      },
      from: {
        email: "ecommerce@gmail.com",
      },
      subject: "Confirm Email",
      text: "blabla",
      body: "<button>Confirm Email</button>",
    });

    return user;
  }
}
