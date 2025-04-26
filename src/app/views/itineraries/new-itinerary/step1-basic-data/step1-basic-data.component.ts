import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { LocalStorageService } from '../../../../services/local-storage.service';

import { ItineraryDTO } from '../../../../models/itinerary.dto';
import { ItineraryService } from '../../../../services/itineraries.service';
import { SharedService } from '../../../../services/shared.services';
import { CategoryDTO } from '../../../../models/category.dto';
import { CategoryService } from '../../../../services/category.service';

@Component({
  selector: 'app-step1-basic-data',
  templateUrl: './step1-basic-data.component.html',
  styleUrl: './step1-basic-data.component.scss'
})
export class Step1BasicDataComponent implements OnInit {
  newItinerary: ItineraryDTO;

  destination: UntypedFormControl;
  startDate: UntypedFormControl;
  endDate: UntypedFormControl;
  rating: UntypedFormControl;
  budget: UntypedFormControl;
  coverImage: UntypedFormControl;
  categories!: UntypedFormControl;

  formStep1: UntypedFormGroup;
  isValidForm: boolean | null;

  categoriesList!: CategoryDTO[];

  private isUpdateMode: boolean;
  private validRequest: boolean;
  private itineraryId: string | null;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private itineraryService: ItineraryService,
    private sharedService: SharedService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private categoryService: CategoryService
  ) {
    this.newItinerary = new ItineraryDTO(
      '', '', new Date(), '', 0, '', new Date(), new Date(), 0, 0, [], ''
    );
    this.itineraryId = this.activatedRoute.snapshot.paramMap.get('id');
    this.isValidForm = null;
    this.isUpdateMode = false;
    this.validRequest = false;

    this.destination = new UntypedFormControl(this.newItinerary.destination, [
      Validators.required,
      Validators.minLength(3),
    ]);

    this.startDate = new UntypedFormControl(
      formatDate(this.newItinerary.startDate, 'yyyy-MM-dd', 'en'),
      [Validators.required]
    );

    this.endDate = new UntypedFormControl(
      formatDate(this.newItinerary.endDate, 'yyyy-MM-dd', 'en'),
      [Validators.required]
    );

    this.rating = new UntypedFormControl(this.newItinerary.rating, []);

    this.budget = new UntypedFormControl(this.newItinerary.budget, []);

    this.coverImage = new UntypedFormControl(this.newItinerary.coverImage, []);

    this.categories = new UntypedFormControl([]);

    this.loadCategories();

    this.formStep1 = this.formBuilder.group({
      title: "",
      publicationDate: new Date(),
      destination: this.destination,
      duration: 0,
      startDate: this.startDate,
      endDate: this.endDate,
      rating: this.rating,
      budget: this.budget,
      coverImage: this.coverImage,
      categories: this.categories,
    });

    this.startDate.valueChanges.subscribe(() => this.updateForm());
    this.endDate.valueChanges.subscribe(() => this.updateForm());
  }
  private async loadCategories(): Promise<void> {
    let errorResponse: any;
  
    this.categoryService.getCategories().subscribe({
      next: (categories: CategoryDTO[]) => {
        this.categoriesList = categories;
      },
      error: (error: HttpErrorResponse) => {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    });
  }

  ngOnInit(): void {}

  private async createItinerary(): Promise<boolean> {
    let errorResponse: any;
    let responseOK: boolean = false;
    const userId = this.localStorageService.get('user_id');
    if (userId) {
      this.newItinerary.userId = userId;
      this.itineraryService.createItinerary(this.newItinerary).pipe(
        finalize(async () => {
          await this.sharedService.managementToast(
            'postFeedback',
            responseOK,
            errorResponse
          );
    
          if (responseOK) {
            this.router.navigateByUrl('/itinerarios/crear-itinerario/paso-2');
          }
        })
      ).subscribe({
        next: () => {
          responseOK = true;
        },
        error: (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      })
    }
    return responseOK;
  }

  private updateForm() {
    const start = new Date(this.startDate.value);
    const end = new Date(this.endDate.value);
  
    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
      const duration = this.calculateDuration(start, end);
      this.formStep1.patchValue({
        duration: duration,
        title: `Itinerario de ${duration} días por ${this.destination.value}`
      }, { emitEvent: false }); 
    }
  }

  private calculateDuration(startDate: Date, endDate: Date): number {
    console.log('fechas', startDate, endDate);
    const diff = endDate.getTime() - startDate.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1; 
  }
  async saveItinerary() {
    this.isValidForm = false;

    if (this.formStep1.invalid) {
      return;
    }

    this.isValidForm = true;

    console.log(this.formStep1.value);
    this.newItinerary = this.formStep1.value

    this.validRequest = await this.createItinerary();
  }
}
