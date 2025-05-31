import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-itinerary',
  templateUrl: './edit-itinerary.component.html',
  styleUrl: './edit-itinerary.component.scss'
})
export class EditItineraryComponent implements OnInit {
  itineraryId!: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.firstChild?.params.subscribe(params => {
      this.itineraryId = params['id'];
    });
  } 
}