import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AccommodationService } from '../../../../services/accommodation.service';
import { TransportService } from '../../../../services/transport.service';
import { RestaurantService } from '../../../../services/restaurant.service';
import { SharedService } from '../../../../services/shared.services';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { filter, map, of, forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ItineraryCreationService } from '../../../../services/itinerary-creation.service';

type FormType = 'alojamiento' | 'transporte' | 'restaurante';
@Component({
  selector: 'app-step3-extras',
  templateUrl: './step3-extras.component.html',
  styleUrls: ['./step3-extras.component.scss'],
})
export class Step3ExtrasComponent implements OnInit {
  sidebarOpen: boolean = false;
  isMobile: boolean = false;
  isEditMode: boolean = false; 
  itineraryId?: string;

  selectedItems: boolean = false;
  showAddOptions: boolean = false;
  searchTerm = '';
  searchResults: any[] = [];
  showFormType: FormType | null = null;

  editingItem: { type: FormType, id: string } | null = null;

  forms: { [key in FormType]: FormGroup } = {
    alojamiento: this.formBuilder.group({ alojamientos: this.formBuilder.array([]) }),
    transporte: this.formBuilder.group({ transportes: this.formBuilder.array([]) }),
    restaurante: this.formBuilder.group({ restaurantes: this.formBuilder.array([]) }),
  }

  selectedExtras: {
    alojamiento: any[],
    restaurante: any[],
    transporte: any[],
  } = {
    alojamiento: [],
    restaurante: [],
    transporte: [],
  };

  filtered: { [key in FormType]: any[] } = {
    alojamiento: [],
    transporte: [],
    restaurante: [],
  };

  searchControl = new FormControl('');

  constructor(
    private formBuilder: FormBuilder,
    private accommodationService: AccommodationService,
    private transportService: TransportService,
    private restaurantService: RestaurantService,
    private sharedService: SharedService,
    private itineraryCreationService: ItineraryCreationService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile.bind(this));

    this.itineraryId = this.route.snapshot.paramMap.get('id') ?? undefined;

    if (this.itineraryId) {
      this.isEditMode = true;
    }

    this.loadFromLocalStorage();

    this.searchControl.valueChanges
    .pipe(
      debounceTime(300), 
      distinctUntilChanged(),
      filter((term): term is string => term !== null),
      map(term => term.trim().toLowerCase()), 
      switchMap((term: string) => {
        this.searchTerm = term;
        if (!term) {
          return of({ accommodations: [], transports: [], restaurants: [] });
        }
        return forkJoin({
          accommodations: this.accommodationService.getAccommodationByName(term),
          transports: this.transportService.getTransportByCompany(term),
          restaurants: this.restaurantService.getRestaurantByName(term)
        });
      })
    )
    .subscribe({
      next:({ accommodations, transports, restaurants }) => {
        this.searchResults = [
          ...accommodations,
          ...transports,
          ...restaurants
        ];
      },
      error: (err) => {
        console.error('Error al buscar alojamiento:', err);
        this.searchResults = [];
      },
    });
  }

  checkMobile() {
    this.isMobile = window.innerWidth < 1025;
    this.sidebarOpen = !this.isMobile;
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  search(): void {
    const term = this.searchTerm.toLowerCase().trim();

    if (!term) {
      this.searchResults = [];
      return;
    }

    forkJoin({
      accommodations: this.accommodationService.getAccommodationByName(term),
      transports: this.transportService.getTransportByCompany(term),
      restaurants: this.restaurantService.getRestaurantByName(term)
    }).subscribe({
      next: ({ accommodations, transports, restaurants }) => {
        this.searchResults = [
          ...accommodations,
          ...transports,
          ...restaurants
        ];
      },
      error: (err) => {
        console.error('Error en alguna de las búsquedas:', err);
        this.searchResults = [];
      }
    });
  }

  selectExistingItem(type: FormType, item: any): void {
    if (!this.selectedExtras[type]) {
      this.selectedExtras[type] = [];
    }

    this.selectedItems = true;
    const exists = this.selectedExtras[type].some((element) => {
      if (type === 'alojamiento') return element.accommodationId === item.accommodationId;
      if (type === 'restaurante') return element.restaurantId === item.restaurantId;
      if (type === 'transporte') return element.transportId === item.transportId;
      return;
    });

    if (!exists) {
      this.selectedExtras[type].push(item);
      this.saveToLocalStorage();
      console.log('Añadido:', this.selectedExtras);
    } else {
      console.log('Este elemento ya se ha añadido a la lista');
    }
  }

  saveToLocalStorage(): void {
    this.itineraryCreationService.setStep3Details({
      accommodations: this.selectedExtras['alojamiento'],
      restaurants: this.selectedExtras['restaurante'],
      transports: this.selectedExtras['transporte']
    });
  }

  loadFromLocalStorage(): void {
    const data = this.itineraryCreationService.getStep3Details();
    if (data) {
      this.selectedExtras = {
        alojamiento: data.accommodations || [],
        restaurante: data.restaurants || [],
        transporte: data.transports || [],
      };
    
      if (data.accommodations?.length === 0 && data.restaurants?.length === 0 && data.transports?.length === 0) {
        this.selectedItems = false;
      } else {
        this.selectedItems = true;
      }
    }
  }

  removeSelected(type: FormType, item: any): void {
    this.selectedExtras[type] = this.selectedExtras[type].filter(i => i !== item);
    this.saveToLocalStorage();
  }

  editSelected(type: FormType, item: any): void {
    // 1. Eliminar el ítem de la lista actual
    this.selectedExtras[type] = this.selectedExtras[type].filter(i => i !== item);
    this.saveToLocalStorage();

    // 2. Mostrar el formulario adecuado
    this.showFormType = type;

    // 3. Cargar el ítem en el formulario
    const formArray = this.getFormArray(type);

    let formGroup: FormGroup;

    if (type === 'alojamiento') {
      formGroup = this.formBuilder.group({
        name: [item.name, Validators.required],
        address: [item.address, Validators.required],
        type: [item.type || ''],
        price: [item.price || '', Validators.min(0)],
        web: [item.web || ''],
      });
    } else if (type === 'transporte') {
      formGroup = this.formBuilder.group({
        company: [item.company, Validators.required],
        type: [item.type || '', Validators.required],
        address: [item.address || '', Validators.required],
        web: [item.web || ''],
      });
    } else {
      // restaurante
      formGroup = this.formBuilder.group({
        name: [item.name, Validators.required],
        address: [item.address, Validators.required],
        type: [item.type || '', Validators.required],
        price: [item.price || '', Validators.min(0)],
        web: [item.web || ''],
      });
    }

    // 4. Añadir el grupo al FormArray para que se muestre el formulario con los datos
    formArray.push(formGroup);

    this.editingItem = { type, id: item.accommodationId || item.transportId || item.restaurantId };
  }

  getFormArray(type: FormType): FormArray {
    const fieldName = {
      alojamiento: 'alojamientos',
      transporte: 'transportes',
      restaurante: 'restaurantes',
    }[type];
    return this.forms[type].get(fieldName) as FormArray;
  }

  // Mostrar formulario correspondiente
  showForm(type: FormType): void {
    this.showFormType = type;
    const formArray = this.getFormArray(type);
    if (formArray.length === 0) this.createEmptyItem(type);
  }

  createEmptyItem(type: FormType): void {
    const groupConfig: { [key in FormType]: () => FormGroup } = {
      alojamiento: () =>
        this.formBuilder.group({
          name: ['', Validators.required],
          address: ['', Validators.required],
          type: [''],
          price: ['', Validators.min(0)],
          web: [''],
        }),
      transporte: () =>
        this.formBuilder.group({
          company: ['', Validators.required],
          type: ['', Validators.required],
          address: ['', Validators.required],
          web: [''],
        }),
      restaurante: () =>
        this.formBuilder.group({
          name: ['', Validators.required],
          address: ['', Validators.required],
          type: ['', Validators.required],
          price: ['', Validators.min(0)],
          web: [''],
        }),
    };

    const formArray = this.getFormArray(type);
    formArray.push(groupConfig[type]()); 
  }

  async addItem(type: 'alojamiento' | 'transporte' | 'restaurante') {
    const formArray = this.getFormArray(type);
    const lastIndex = formArray.length - 1;
    const lastItem = lastIndex >= 0 ? formArray.at(lastIndex) : null;

    let responseOK = false;
    let errorResponse: any;

    if (lastItem && lastItem.invalid) {
      return;
    }

    if (lastItem) {
      try {
        const itemData = lastItem.value;

        let savedItem;

        if (this.editingItem && this.editingItem.type === type) {
          savedItem = await this.updateItemInBackend(type, this.editingItem.id, itemData);
          this.editingItem = null; 
        } else {
          savedItem = await this.saveItemToBackend(type, itemData);
        }

        // Guardar en selectedExtras y añadir nuevo formulario
        this.selectedExtras[type].push(savedItem);
        this.saveToLocalStorage();
        lastItem.reset();

        responseOK = true;
        await this.sharedService.managementToast(
          `toast`,
          responseOK
        );
      } catch (error) {
        await this.sharedService.managementToast(
          `toast`,
          false,
          errorResponse?.message || 'Hubo un error al guardar el ítem. Inténtalo de nuevo.'
        );

      this.sharedService.errorLog(errorResponse);
      }
    } else {
      // Si no hay ítems todavía, añade uno vacío directamente
      formArray.push(this.createEmptyItem(type));
    }
  }

  updateItemInBackend(type: FormType, id: string, itemData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (type === 'alojamiento') {
        this.accommodationService.updateAccommodation(id, itemData).subscribe({
          next: resolve,
          error: reject
        });
      } else if (type === 'transporte') {
        this.transportService.updateTransport(id, itemData).subscribe({
          next: resolve,
          error: reject
        });
      } else if (type === 'restaurante') {
        this.restaurantService.updateRestaurant(id, itemData).subscribe({
          next: resolve,
          error: reject
        });
      } else {
        reject(new Error(`Tipo de item no soportado: ${type}`));
      }
    });
  }
  saveItemToBackend(type: string, itemData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (type === 'alojamiento') {
        this.accommodationService.createAccommodation(itemData).subscribe({
          next: (savedItem) => {
            resolve(savedItem);
          },
          error: (err) => {
            reject(err);
          }
        });
      } else if (type === 'transporte') {
        this.transportService.createTransport(itemData).subscribe({
          next: (savedItem) => {
            resolve(savedItem);
          },
          error: (err) => {
            reject(err);
          }
        });
      } else if (type === 'restaurante') {
        this.restaurantService.createRestaurant(itemData).subscribe({
          next: (savedItem) => {
            resolve(savedItem);
          },
          error: (err) => {
            reject(err);
          }
        });
      } else {
        reject(new Error(`Tipo de item no soportado: ${type}`));
      }
    });
  }

  redirectTo(): void {
    if (this.isEditMode) {
      this.router.navigateByUrl(`/itinerarios/editar/resumen/${this.itineraryId}`); 
    } else {
      this.router.navigateByUrl('/itinerarios/crear-itinerario/resumen');
    }
  }
}
