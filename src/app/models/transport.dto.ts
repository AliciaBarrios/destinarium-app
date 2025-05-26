export class TransportDTO {
    transportId!: string;
    company: string;
    type: string;
    address: string;
    web: string;

    constructor(company: string, type: string, address: string, web: string) {
      this.company = company;
      this.type = type;
      this.address = address;
      this.web = web;
    }
}