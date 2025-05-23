export class AccommodationDTO {
    accommodationId!: string;
    name: string;
    type: string;
    address: string;
    price: number;
    web: string;

    constructor(name: string, type: string, address: string, price: number, web: string) {
      this.name = name;
      this.type = type;
      this.address = address;
      this.price = price;
      this.web = web;
    }
}