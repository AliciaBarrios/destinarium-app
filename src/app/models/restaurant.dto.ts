export class RestaurantDTO {
    restaurantId!: string;
    name: string;
    type: string;
    location: string;
    price: number;
    rating: number;
    web: string;

    constructor(name: string, type: string, location: string, price: number, rating: number, web: string) {
      this.name = name;
      this.type = type;
      this.location = location;
      this.price = price;
      this.rating = rating;
      this.web = web;
    }
}