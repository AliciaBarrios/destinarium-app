import { Component, Input } from '@angular/core';
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
    category: '',
    rating: 0
  };
}
