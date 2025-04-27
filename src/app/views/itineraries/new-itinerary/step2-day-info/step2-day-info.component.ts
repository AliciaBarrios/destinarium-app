import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, UntypedFormGroup, FormArray, Validators } from '@angular/forms';
import { QuillEditorComponent } from 'ngx-quill';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-step2-day-info',
  templateUrl: './step2-day-info.component.html',
  styleUrl: './step2-day-info.component.scss'
})
export class Step2DayInfoComponent implements OnInit {
  dayForm: UntypedFormGroup;
  dayCount: number = 0;

  @ViewChild(QuillEditorComponent) quillEditor!: QuillEditorComponent;
  quillInstance: any;

  constructor(
    private formBuilder: FormBuilder, 
    private http: HttpClient
  ) {
    this.dayForm = this.formBuilder.group({
      days: this.formBuilder.array([])
    });
  }

  ngOnInit() {
    this.addNewDay();
  }

  get days(): FormArray {
    return this.dayForm.get('days') as FormArray;
  }

  addNewDay(): void {
    const dayGroup = this.formBuilder.group({
      startPlace: ['', Validators.required],
      endPlace: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.days.push(dayGroup);
    this.dayCount = this.days.length; 
  }

  // Método para eliminar un día
  removeDay(index: number): void {
    this.days.removeAt(index);
    this.dayCount = this.days.length; 
  }

  quillModules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline'],
        ['image']
      ],
      handlers: {
        image: () => this.customImageUpload()
      }
    }
  };

  editorContent = '';

  // Evento cuando se crea el editor de Quill
  onEditorCreated(quill: any) {
    this.quillInstance = quill;  
  }

  // Método para obtener el contenido del editor
  getEditorContent(): string {
    if (this.quillInstance) {
      return this.quillInstance.root.innerHTML;  
    }
    return '';
  }

  // Función personalizada para subir imágenes
  customImageUpload() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files![0];
      const formData = new FormData();
      formData.append('file', file);

      // Subimos la imagen al backend
      const response = await this.http.post<{ url: string }>(
        'http://localhost:3000/uploads',
        formData
      ).toPromise();

      const range = this.quillInstance.getSelection();
      this.quillInstance.insertEmbed(range.index, 'image', response!.url);
    };
  }

  onSubmit() {
    if (this.dayForm.valid) {
      console.log(this.dayForm.value);
    }
  }
}
