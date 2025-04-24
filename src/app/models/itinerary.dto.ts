import { CategoryDTO } from "./category.dto";
import { DayDTO } from "./day.dto";
import { RestaurantDTO } from "./restaurant.dto";
import { AccommodationDTO } from "./accommodation.dto";
import { TransportDTO } from "./transport.dto";

export class ItineraryDTO {
    itineraryId: string;
    title: string;
    publicationDate: Date;
    userAlias?: string;
    userId: string;
    duration: number;
    destination: string;
    startDate: Date;
    endDate: Date;
    rating: number;
    budget: number;
    categories: CategoryDTO[];
    coverImage: string;
    transports?: TransportDTO[];
    accommodations?: AccommodationDTO[];
    restaurants?: RestaurantDTO[];
    days?: DayDTO[];
  
    constructor(
      itineraryId: string,
      title: string,
      publicationDate: Date,
      userId: string,
      duration: number,
      destination: string,
      startDate: Date,
      endDate: Date,
      rating: number,
      budget: number,
      categories: CategoryDTO[],
      coverImage: string,
      userAlias?: string,
      transports?: TransportDTO[],
      accommodations?: AccommodationDTO[],
      restaurants?: RestaurantDTO[],
      days?: DayDTO[]
    ) {
      this.itineraryId = itineraryId;
      this.title = title;
      this.publicationDate = publicationDate;
      this.userId = userId;
      this.duration = duration;
      this.destination = destination;
      this.startDate = startDate;
      this.endDate = endDate;
      this.rating = rating;
      this.budget = budget;
      this.categories = categories;
      this.coverImage = coverImage;
      this.userAlias = userAlias;
      this.transports = transports;
      this.accommodations = accommodations;
      this.restaurants = restaurants;
      this.days = days;
    }
  }