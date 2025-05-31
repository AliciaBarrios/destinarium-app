import { Component, OnInit, ChangeDetectionStrategy, signal} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItineraryService } from '../../../services/itineraries.service';
import { SharedService } from '../../../services/shared.services';
import { ItineraryDTO } from '../../../models/itinerary.dto';
import { DayDTO } from '../../../models/day.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-itinerary-details',
  templateUrl: './itinerary-details.component.html',
  styleUrl: './itinerary-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItineraryDetailsComponent implements OnInit {
  readonly panelOpenState = signal(false);
  itinerary: ItineraryDTO = new ItineraryDTO('','',new Date(),'',0,'',new Date(), new Date(), 0, 0, [], '');
  apiUrl: string = environment.apiUrlDestinarium;
  visibleDaysCount: number = 3;

  constructor(
    private activatedRoute: ActivatedRoute,
    private itineraryService: ItineraryService,
    private sharedService: SharedService,
    private router: Router,
    private changeDetector: ChangeDetectorRef, 
  ) {}

  ngOnInit() {
    const itineraryId = this.activatedRoute.snapshot.paramMap.get('id');

    if(!itineraryId) {
      this.router.navigateByUrl('/');
      return;
    }

    this.getItinerary(itineraryId);
  }

   private async getItinerary(id: any): Promise<void> {
    let errorResponse: any;
    this.itineraryService.getItineraryById(id).subscribe({
      next: (data: ItineraryDTO) => {
        if(data.days) {
          data.days = data.days.sort((a, b) => a.dayNumber - b.dayNumber);
        }
        this.itinerary = data;
        this.changeDetector.detectChanges(); 
      },
      error: (error: HttpErrorResponse) => {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    });
  }

  get visibleDays() {
    return this.itinerary?.days?.slice(0, this.visibleDaysCount) || [];
  }

  showMoreDays() {
    this.visibleDaysCount += 3;
  }

  setDefaultImage(event: Event) {
    (event.target as HTMLImageElement).src = '../../../../assets/predeterminada-img.webp';
  }
}
