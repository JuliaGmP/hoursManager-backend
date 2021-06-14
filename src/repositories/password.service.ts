import { Provider, ValueOrPromise } from '@loopback/core';

export interface PasswordInterface {
  // this is where you define the Node.js methods that will be
  // mapped to the SOAP operations as stated in the datasource
  // json file.
  generateRandomPassword(): Promise<string>;
}

export class PasswordService implements PasswordInterface {
  constructor() { }
  async generateRandomPassword(): Promise<string> {

    const lengthRandomPassword = 8;
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < lengthRandomPassword; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

}

export class PasswordServiceProvider implements Provider<PasswordInterface> {
  constructor(protected service: PasswordService = new PasswordService()) { }

  value(): ValueOrPromise<PasswordInterface> {
    return this.service;
  }
}
