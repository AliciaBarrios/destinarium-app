import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AccommodationService } from '../../../../services/accommodation.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { filter, map } from 'rxjs';

type FormType = 'alojamiento' | 'transporte' | 'restaurante';
@Component({
  selector: 'app-step3-extras',
  templateUrl: './step3-extras.component.html',
  styleUrls: ['./step3-extras.component.scss'],
})
export class Step3ExtrasComponent implements OnInit {
  showAddOptions = false;
  searchTerm = '';
  searchResults: any[] = [];
  showFormType: FormType | null = null;

  forms: { [key in FormType]: FormGroup } = {
    alojamiento: this.formBuilder.group({ alojamientos: this.formBuilder.array([]) }),
    transporte: this.formBuilder.group({ transportes: this.formBuilder.array([]) }),
    restaurante: this.formBuilder.group({ restaurantes: this.formBuilder.array([]) }),
  }

  filtered: { [key in FormType]: any[] } = {
    alojamiento: [],
    transporte: [],
    restaurante: [],
  };

  // searchControl = this.formBuilder.control('');
  searchControl = new FormControl('');

  constructor(
    private formBuilder: FormBuilder,
    private accommodationService: AccommodationService,
  ) {}

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(200), 
        distinctUntilChanged(),
        filter((term): term is string => term !== null),
        map(term => term.trim().toLowerCase()), 
        switchMap((term: string) => {
          const trimmed = term.trim().toLowerCase();
          return trimmed
            ? this.accommodationService.getAccommodationByName(trimmed)
            : [];
        })
      )
      .subscribe({
        next: (results) => {
          this.searchResults = results;
        },
        error: (err) => {
          console.error('Error al buscar alojamiento:', err);
          this.searchResults = [];
        },
      });
  }

  search(): void {
    const term = this.searchTerm.toLowerCase().trim();

    if (!term) {
      this.searchResults = [];
      return;
    }


    this.accommodationService.getAccommodationByName(term).subscribe({
      next: (results) => {
        this.searchResults = results;
      },
      error: (err) => {
        console.error('Error al buscar alojamiento:', err);
        this.searchResults = [];
      },
    });
  }

  // Mostrar formulario correspondiente
  showForm(type: FormType): void {
    this.showFormType = type;
    const formArray = this.getFormArray(type);
    if (formArray.length === 0) this.addItem(type);
  }

  addItem(type: FormType): void {
    const groupConfig: { [key in FormType]: () => FormGroup } = {
      alojamiento: () =>
        this.formBuilder.group({
          name: ['', Validators.required],
          adress: ['', Validators.required],
          type: [''],
          price: ['', Validators.min(0)],
          web: [''],
        }),
      transporte: () =>
        this.formBuilder.group({
          company: ['', Validators.required],
          from: ['', Validators.required],
          to: ['', Validators.required],
          type: ['', Validators.required],
          day: [''],
        }),
      restaurante: () =>
        this.formBuilder.group({
          name: ['', Validators.required],
          address: ['', Validators.required],
          type: ['', Validators.required],
          day: [''],
          web: [''],
        }),
    };

    this.getFormArray(type).push(groupConfig[type]());
  }

  removeItem(type: FormType, index: number): void {
    this.getFormArray(type).removeAt(index);
  }

  getFormArray(type: FormType): FormArray {
    const fieldName = {
      alojamiento: 'alojamientos',
      transporte: 'transportes',
      restaurante: 'restaurantes',
    }[type];
    return this.forms[type].get(fieldName) as FormArray;
  }

  onSubmit(): void {
    if (!this.showFormType) return;
    const form = this.forms[this.showFormType];
    if (form.valid) {
      console.log(`${this.showFormType}s:`, form.value);
    }
  }
}
