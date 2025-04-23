export class DayDTO {
    dayId!: string;
    start_location: string;
    end_location: string;
    description: string;
  
    constructor(start_location: string, end_location: string, description: string) {
      this.start_location = start_location;
      this.end_location = end_location;
      this.description = description;
    }
}