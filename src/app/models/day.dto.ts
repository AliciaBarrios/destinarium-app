export class DayDTO {
    startLocation: string;
    endLocation: string;
    description: string;
    dayNumber: number;
    itineraryId?: string;  
  
    constructor(startLocation: string, endLocation: string, description: string, dayNumber: number, itineraryId: string) {
      this.startLocation = startLocation;
      this.endLocation = endLocation;
      this.description = description;
      this.dayNumber = dayNumber;
      this.itineraryId = itineraryId;
    }
}