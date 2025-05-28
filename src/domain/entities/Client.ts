interface IClient {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
}

export class Client {
  private id: number;
  private firstName: string;
  private lastName: string;
  private phoneNumber: string;
  private address: string;

  constructor(client: IClient) {
    this.id = 0;
    this.firstName = client.firstName;
    this.lastName = client.lastName;
    this.phoneNumber = client.phoneNumber;
    this.address = client.address;
  }
}
