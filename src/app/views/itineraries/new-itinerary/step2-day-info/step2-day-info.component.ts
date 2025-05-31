import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { QuillEditorComponent } from 'ngx-quill';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, UntypedFormGroup, FormArray, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ItineraryCreationService } from '../../../../services/itinerary-creation.service';
import { DayService } from '../../../../services/day.service';
import { DayDTO } from '../../../../models/day.dto';
import { SharedService } from '../../../../services/shared.services';

@Component({
  selector: 'app-step2-day-info',
  templateUrl: './step2-day-info.component.html',
  styleUrl: './step2-day-info.component.scss'
})
export class Step2DayInfoComponent implements OnInit {
  @ViewChildren(QuillEditorComponent) quillEditors!: QueryList<QuillEditorComponent>;
  dayForm: UntypedFormGroup;
  dayCount: number = 0;
  itineraryDuration: number = 0;
  itineraryId?: string; 
  isEditMode: boolean = false;

  constructor(
    private formBuilder: FormBuilder, 
    private http: HttpClient,
    private itineraryCreationService: ItineraryCreationService,
    private router: Router,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private dayService: DayService
  ) {
    this.dayForm = this.formBuilder.group({
      days: this.formBuilder.array([])
    });
  }

  ngOnInit() {
    const step1 = this.itineraryCreationService.getStep1Data();
    this.itineraryDuration = step1.duration ?? 0;

    this.itineraryId = this.route.snapshot.paramMap.get('id') ?? undefined;

    if (this.itineraryId) {
      this.isEditMode = true;
    }

    const existingItinerary = this.itineraryCreationService.getExistingItinerary();

    if (existingItinerary && existingItinerary.days && existingItinerary.days.length > 0) {
      this.days.clear();
      existingItinerary.days.forEach((day: any) => this.addNewDayFromData(day));
    } else {
      this.loadDraftDays();
    }

    this.dayForm.valueChanges.subscribe(() => {
      this.saveDraftDays();
    });
  }

  saveDraftDays(): void {
    const days = this.days.getRawValue();
    this.itineraryCreationService.setStep2Days(days);
  }

  loadDraftDays(): void {
    const savedDays = this.itineraryCreationService.getStep2Days();
    if (savedDays.length > 0) {
      savedDays.forEach(day => this.addNewDayFromData(day));
    } else {
      this.addNewDay();
    }
  }

  addNewDayFromData(dayData: any): void {
    const dayGroup = this.formBuilder.group({
      dayNumber: [dayData.dayNumber],
      startLocation: [dayData.startLocation, Validators.required],
      endLocation: [dayData.endLocation, Validators.required],
      description: [dayData.description || ''],
      dayId: [dayData.dayId || ''],
    });

    this.days.push(dayGroup);
    this.dayCount = this.days.length;
    this.updateDayNumbers();
  }

  addNewDay(): void {
      if (this.days.length >= this.itineraryDuration) {
        this.sharedService.managementToast('toast', true, undefined, 'No puedes añadir más días que la duración del itinerario');
      return;
    }

    const dayGroup = this.formBuilder.group({
      dayNumber: [this.dayCount + 1],
      startLocation: ['', Validators.required],
      endLocation: ['', Validators.required],
      description: [''], 
    });

    this.days.push(dayGroup);
    this.dayCount = this.days.length; 
    this.updateDayNumbers();
  }

  get days(): FormArray {
    return this.dayForm.get('days') as FormArray;
  }

  removeDay(index: number): void {
    const dayId = this.days.at(index).value.dayId;
    
    this.days.removeAt(index);
    this.dayCount = this.days.length; 
    this.updateDayNumbers();

    if (this.isEditMode && dayId) {
      this.dayService.deleteDay(dayId).subscribe({
      next: (response: any) => {
        console.log(`Día ${dayId} eliminado en backend, filas afectadas:`, response.affected);
      },
      error: (err: any) => {
        console.error(`Error al eliminar día ${dayId} en backend`, err);
      }
    });
    }
  }

  updateDayNumbers(): void {
    this.days.controls.forEach((group, index) => {
      group.get('dayNumber')?.setValue(index + 1);
    });
  }

  getQuillModules(index: number) {
    return {
      toolbar: {
        container: [
          ['bold', 'italic', 'underline'],
          ['image']
        ],
        handlers: {
          image: () => this.customImageUpload(index)
        }
      }
    };
  }

  editorContent = '';
  customImageUpload(index: number) {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files![0];
      const formData = new FormData();
      formData.append('coverImage', file);

      try {
        const response = await this.http.post<{ url: string }>(
          'http://localhost:3000/itineraries/upload-image',
          formData
        ).toPromise();

        const quillEditor = this.quillEditors.get(index);
        if (!quillEditor) {
          console.error('Editor no encontrado para el índice', index);
          return;
        }

        const editor = quillEditor.quillEditor;
        const range = editor.getSelection(true);
        if (range) {
          editor.insertEmbed(range.index, 'image', response!.url);
          editor.setSelection({ index: range.index + 1, length: 0 });
        } 
      } catch (error) {
        console.error('Error subiendo imagen:', error);
      }
    };
  }

  onEditorContentChanged(event: any, index: number): void {
    const html = event.html;
    const control = this.days.at(index).get('description');

    if (control?.value !== html) {
      control?.patchValue(html, { emitEvent: false });
    }
  }

  onSubmit(): void {
    if (this.dayForm.valid) {
      const daysToSave: DayDTO[] = this.days.controls.map(control => {
        return new DayDTO(
          control.get('startLocation')?.value,
          control.get('endLocation')?.value,
          control.get('description')?.value,
          control.get('dayNumber')?.value,
          this.itineraryId!, 
        );
      });
      this.itineraryCreationService.setStep2Days(daysToSave);

      if (this.isEditMode) {
        this.router.navigateByUrl(`/itinerarios/editar/paso-3/${this.itineraryId}`);
      } else {
        this.router.navigateByUrl('/itinerarios/crear-itinerario/paso-3');
      }
    } else {
      console.log('Formulario inválido');
    }
  }
}
