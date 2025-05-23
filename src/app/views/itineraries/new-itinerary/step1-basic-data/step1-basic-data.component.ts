import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { LocalStorageService } from '../../../../services/local-storage.service';

import { ItineraryDTO } from '../../../../models/itinerary.dto';
import { ItineraryService } from '../../../../services/itineraries.service';
import { ItineraryCreationService } from '../../../../services/itinerary-creation.service';
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

  constructor(
    private formBuilder: UntypedFormBuilder,
    private itineraryService: ItineraryService,
    private itineraryCreationService: ItineraryCreationService,
    private sharedService: SharedService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private categoryService: CategoryService
  ) {
    this.newItinerary = new ItineraryDTO(
      '', '', new Date(), '', 0, '', new Date(), new Date(), 0, 0, [], ''
    );

    this.isValidForm = null;

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

    this.rating = new UntypedFormControl(this.newItinerary.rating, [
      Validators.min(0),
      Validators.max(5),
    ]);

    this.budget = new UntypedFormControl(this.newItinerary.budget, [
      Validators.min(0),
    ]);

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

  ngOnInit(): void {
    const draft = this.localStorageService.get('draft_itinerary');
    if (draft) {
      this.formStep1.patchValue(JSON.parse(draft));
    }
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

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadImage(file);
    }
  }

  private uploadImage(file: File) {
    const formData = new FormData();
    formData.append('coverImage', file, file.name);

    this.itineraryService.uploadImage(formData).subscribe({
      next: (response) => {
        this.coverImage.setValue(response.fileName);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al subir la imagen', error);
      }
    });
  }

  private calculateDuration(startDate: Date, endDate: Date): number {
    const diff = endDate.getTime() - startDate.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1; 
  }
  async saveItinerary() {
    this.isValidForm = false;

    if (this.formStep1.invalid) {
      return;
    }

    this.isValidForm = true;
    this.updateForm(); 
    const itineraryData = this.formStep1.value;

    // Guardar datos del paso 1 en el servicio para recuperarlo en el útlimo paso
    this.itineraryCreationService.setStep1(itineraryData);
    this.localStorageService.set('draft_itinerary', JSON.stringify(itineraryData)); 
    // Ir al paso 2
    this.router.navigateByUrl('/itinerarios/crear-itinerario/paso-2');
  }
}
