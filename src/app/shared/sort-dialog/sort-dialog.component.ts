import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface SortOption {
  value: string;
  label: string;
}
@Component({
  selector: 'app-sort-dialog',
  templateUrl: './sort-dialog.component.html',
  styleUrl: './sort-dialog.component.scss'
})
export class SortDialogComponent {

  selectedOption: string;
  options: SortOption[] = [];

  constructor(
    public dialogRef: MatDialogRef<SortDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      currentSort: string,
      options: SortOption[]
    }
  ) {
    this.options = data.options || [];
    this.selectedOption = data.currentSort || (this.options.length ? this.options[0].value : '');
  }

  onConfirm() {
    this.dialogRef.close(this.selectedOption);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
