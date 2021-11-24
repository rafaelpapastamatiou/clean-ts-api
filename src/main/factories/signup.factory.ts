import { DbAddAccount } from "../../data/useCases/addAccount/db-add-account";
import { BcryptAdapter } from "../../infra/cryptography/bcrypt.adapter";
import { MongoAccountRepository } from "../../infra/database/mongodb/repositories/account/account.repository";
import { MongoLogRepository } from "../../infra/database/mongodb/repositories/log/log.repository";
import { SignUpController } from "../../presentation/controllers/signup/signup.controller";
import { IController } from "../../presentation/protocols";
import { LogControllerDecorator } from "../decorators/log-controller.decorator";
import { makeSignUpValidation } from "./signup-validation.factory";

export const makeSignUpController = (): IController => {
  const mongoAccountRepository = new MongoAccountRepository();
  const mongoLogRepository = new MongoLogRepository();

  const salt = 10;
  const bcryptAdapter = new BcryptAdapter(salt);

  const dbAddAccount = new DbAddAccount(bcryptAdapter, mongoAccountRepository);

  const validationComposite = makeSignUpValidation();

  const signUpController = new SignUpController(
    dbAddAccount,
    validationComposite
  );

  return new LogControllerDecorator(signUpController, mongoLogRepository);
};
