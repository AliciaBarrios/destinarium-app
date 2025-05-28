import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export type SortOption = 'category' | 'destination-a-z' | 'destination-z-a' | 'rating-5-0' | 'rating-0-5' | 'duration-asc' | 'duration-des';

@Component({
  selector: 'app-sort-dialog',
  templateUrl: './sort-dialog.component.html',
  styleUrl: './sort-dialog.component.scss'
})
export class SortDialogComponent {

  selectedOption: SortOption;

  constructor(
    public dialogRef: MatDialogRef<SortDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { currentSort: SortOption }
  ) {
    this.selectedOption = data.currentSort || 'destination-a-z';
  }

  onConfirm() {
    this.dialogRef.close(this.selectedOption);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
