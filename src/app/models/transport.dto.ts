export class TransportDTO {
    transportId!: string;
    company: string;
    type: string;
    adress: string;
    web: string;

    constructor(company: string, type: string, adress: string, web: string) {
      this.company = company;
      this.type = type;
      this.adress = adress;
      this.web = web;
    }
}