import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { FormBuilder, UntypedFormGroup, FormArray, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DayService } from '../../../../services/day.service';
import { SharedService } from '../../../../services/shared.services';
import { DayDTO } from '../../../../models/day.dto';

@Component({
  selector: 'app-step2-day-info',
  templateUrl: './step2-day-info.component.html',
  styleUrl: './step2-day-info.component.scss'
})
export class Step2DayInfoComponent implements OnInit {
  dayForm: UntypedFormGroup;
  dayCount: number = 0;
  itineraryId: string | null = null; 

  constructor(
    private formBuilder: FormBuilder, 
    private http: HttpClient,
    private dayService: DayService,
    private sharedService: SharedService,
    private router: Router,
  ) {
    this.dayForm = this.formBuilder.group({
      days: this.formBuilder.array([])
    });
  }

  ngOnInit() {
    this.itineraryId = this.sharedService.getItineraryIdValue();
    if (!this.itineraryId) {
      console.warn('No se encontró itineraryId');
      return;
    }
    this.addNewDay();
  }

  get days(): FormArray {
    return this.dayForm.get('days') as FormArray;
  }

  addNewDay(): void {
    const dayGroup = this.formBuilder.group({
      dayNumber: [this.dayCount + 1],
      startPlace: ['', Validators.required],
      endPlace: ['', Validators.required],
      description: ['']
    });

    this.days.push(dayGroup);
    this.dayCount = this.days.length; 

    this.updateDayNumbers();
  }

  // Método para eliminar un día
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
      formData.append('file', file);

      try {
        const response = await this.http.post<{ url: string }>(
          'http://localhost:3000/itineraries/upload-image',
          formData
        ).toPromise();

        const quillEditors = document.querySelectorAll('quill-editor');
        const editor = (quillEditors[index] as any).__quill; // acceder a la instancia Quill

        const range = editor.getSelection(true);
        editor.insertEmbed(range.index, 'image', response!.url);
        editor.setSelection(range.index + 1);
      } catch (error) {
        console.error('Error subiendo imagen:', error);
      }
    };
  }

  onSubmit(): void {
    if (this.dayForm.valid) {
      const daysToSend: DayDTO[] = this.days.controls.map(control => {
        return new DayDTO(
          control.get('startPlace')?.value,
          control.get('endPlace')?.value,
          control.get('description')?.value,
          control.get('dayNumber')?.value,
          this.itineraryId!, 
        );
      });

      let responseOK = false;
      let errorResponse: any;

      this.dayService.newDays(daysToSend).pipe(
        finalize(async () => {
          await this.sharedService.managementToast(
            'step2Feedback',
            responseOK,
            errorResponse
          );

          if (responseOK) {
            this.router.navigateByUrl('/itinerarios/crear-itinerario/paso-3');
          }
        })
      ).subscribe({
        next: (response) => {
          responseOK = true;
          console.log('Días creados:', response);
        },
        error: (error) => {
          responseOK = false;
          errorResponse = error.error;
          console.error('Error creando días:', error);
          this.sharedService.errorLog(errorResponse);
        }
      });
    } else {
      console.log('Formulario inválido');
    }
  }
}
