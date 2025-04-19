import { Component, Input } from '@angular/core';
import { SimpleCard } from '../../models/simple-card.interface';

@Component({
  selector: 'app-simple-card',
  templateUrl: './simple-card.component.html',
  styleUrl: './simple-card.component.scss'
})
export class SimpleCardComponent {

  @Input() card: SimpleCard = { imageUrl: '', link: '', title: '' };

}
