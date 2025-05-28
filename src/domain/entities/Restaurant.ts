interface IRestaurant {
  name: string;
  phoneNumber: string;
  address: string;
}

export class Restaurant {
  private id: number;
  private name: string;
  private phoneNumber: string;
  private address: string;

  constructor(restaurant: IRestaurant) {
    this.id = 0;
    this.name = restaurant.name;
    this.phoneNumber = restaurant.phoneNumber;
    this.address = restaurant.address;
  }
}
