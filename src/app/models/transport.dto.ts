export class TransportDTO {
    transportId!: string;
    company: string;
    type: string;
    adress: string;
    price: number;
    rating: number;
    web: string;

    constructor(company: string, type: string, adress: string, price: number, rating: number, web: string) {
      this.company = company;
      this.type = type;
      this.adress = adress;
      this.price = price;
      this.rating = rating;
      this.web = web;
    }
}