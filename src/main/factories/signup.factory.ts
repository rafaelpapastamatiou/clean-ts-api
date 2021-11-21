import { DbAddAccount } from "../../data/useCases/addAccount/db-add-account";
import { BcryptAdapter } from "../../infra/cryptography/bcrypt.adapter";
import { MongoAccountRepository } from "../../infra/database/mongodb/repositories/account/account.repository";
import { SignUpController } from "../../presentation/controllers/signup/signup.controller";
import { EmailValidatorAdapter } from "../../utils/email-validator.adapter";

export const makeSignUpController = (): SignUpController => {
  const emailValidatorAdapter = new EmailValidatorAdapter();

  const mongoAccountRepository = new MongoAccountRepository();

  const salt = 10;
  const bcryptAdapter = new BcryptAdapter(salt);

  const dbAddAccount = new DbAddAccount(bcryptAdapter, mongoAccountRepository);

  const signUpController = new SignUpController(
    emailValidatorAdapter,
    dbAddAccount
  );

  return signUpController;
};
