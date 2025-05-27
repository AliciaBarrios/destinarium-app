import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { QuillEditorComponent } from 'ngx-quill';
import { Router } from '@angular/router';
import { FormBuilder, UntypedFormGroup, FormArray, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ItineraryCreationService } from '../../../../services/itinerary-creation.service';
import { DayDTO } from '../../../../models/day.dto';

@Component({
  selector: 'app-step2-day-info',
  templateUrl: './step2-day-info.component.html',
  styleUrl: './step2-day-info.component.scss'
})
export class Step2DayInfoComponent implements OnInit {
  @ViewChildren(QuillEditorComponent) quillEditors!: QueryList<QuillEditorComponent>;
  dayForm: UntypedFormGroup;
  dayCount: number = 0;
  itineraryId: string | null = null; 

  constructor(
    private formBuilder: FormBuilder, 
    private http: HttpClient,
    private itineraryCreationService: ItineraryCreationService,
    private router: Router,
  ) {
    this.dayForm = this.formBuilder.group({
      days: this.formBuilder.array([])
    });
  }

  ngOnInit() {
    this.loadDraftDays();
  }

  saveDraftDays(): void {
    const days = this.days.getRawValue();
    console.log(days);
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
      description: [dayData.description || '']
    });

    this.days.push(dayGroup);
    this.dayCount = this.days.length;
    this.updateDayNumbers();
  }

  addNewDay(): void {
    const dayGroup = this.formBuilder.group({
      dayNumber: [this.dayCount + 1],
      startLocation: ['', Validators.required],
      endLocation: ['', Validators.required],
      description: ['']
    });

    this.days.push(dayGroup);
    this.dayCount = this.days.length; 
    this.updateDayNumbers();
  }

  get days(): FormArray {
    return this.dayForm.get('days') as FormArray;
  }

  removeDay(index: number): void {
    this.days.removeAt(index);
    this.dayCount = this.days.length; 
    this.updateDayNumbers();
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
      this.router.navigateByUrl('/itinerarios/crear-itinerario/paso-3');
    } else {
      console.log('Formulario inválido');
    }
  }
}
