import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { CategoryService } from '../../services/category.service';

export interface FilterData {
  destination?: string;
  minRating?: number;
  maxRating?: number;
  selectedCategories?: string[];
  minDuration?: number;
  maxDuration?: number;
}

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.scss']
})
export class FilterDialogComponent implements OnInit {
  filtersForm: FormGroup;
  categories: string[] = [];
  data: FilterData;

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    public dialogRef: MatDialogRef<FilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public passedData: FilterData
  ) {
    this.data = { ...passedData };
    this.filtersForm = new FormGroup({
      destination: new FormControl(this.data.destination || ''),
      minRating: new FormControl(this.data.minRating || 0),
      maxRating: new FormControl(this.data.maxRating || 5),
      minDuration: new FormControl(this.data.minDuration || null),
      maxDuration: new FormControl(this.data.maxDuration || null),
      selectedCategories: new FormControl(this.data.selectedCategories || [])
    });
  }

  ngOnInit() {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories.map(cat => cat.title);
      this.initForm();
    });
  }

  private initForm() {
    this.filtersForm = this.formBuilder.group({
      destination: [this.data.destination || ''],
      minRating: [this.data.minRating ?? null],
      maxRating: [this.data.maxRating ?? null],
      minDuration: [this.data.minDuration ?? null],
      maxDuration: [this.data.maxDuration ?? null],
      selectedCategories: this.buildCategoriesFormArray()
    });
  }

  private buildCategoriesFormArray() {
    const arr = this.categories.map(cat =>
      new FormControl(this.data.selectedCategories?.includes(cat) || false)
    );
    return this.formBuilder.array(arr);
  }

  get selectedCategoriesArray() {
    return this.filtersForm.get('selectedCategories') as FormArray;
  }

  toggleCategory(index: number) {
    const control = this.selectedCategoriesArray.at(index);
    control.setValue(!control.value);
  }

  applyFilters() {
    const formValue = this.filtersForm.value;
    const selectedCats = this.categories.filter((_, i) => formValue.selectedCategories[i]);
    const result: FilterData = {
      destination: formValue.destination,
      minRating: formValue.minRating,
      maxRating: formValue.maxRating,
      minDuration: formValue.minDuration,
      maxDuration: formValue.maxDuration,
      selectedCategories: selectedCats
    };
    this.dialogRef.close(result);
  }

  clearFilters() {
    this.dialogRef.close(null);
  }

  get selectedCategoryControls(): FormControl[] {
    return (this.filtersForm.get('selectedCategories') as FormArray).controls as FormControl[];
  }
}
