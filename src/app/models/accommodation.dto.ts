export class AccommodationDTO {
    accommodationId!: string;
    name: string;
    type: string;
    adress: string;
    price: number;
    web: string;

    constructor(name: string, type: string, adress: string, price: number, web: string) {
      this.name = name;
      this.type = type;
      this.adress = adress;
      this.price = price;

      this.web = web;
    }
}