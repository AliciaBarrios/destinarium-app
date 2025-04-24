import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FullCard } from '../../models/full-card.interface';

@Component({
  selector: 'app-full-card',
  templateUrl: './full-card.component.html',
  styleUrl: './full-card.component.scss'
})
export class FullCardComponent {
  @Input() card: FullCard = {
    imageUrl: '',
    link: '',
    title: '',
    date: new Date(''),
    author: '',
    categories: [],
    rating: 0
  };

  @Output() edit = new EventEmitter<void>(); 
  @Output() delete = new EventEmitter<void>(); 

  onEdit() {
    this.edit.emit(); 
  }

  onDelete() {
    this.delete.emit();
  }
}
