import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItineraryConfirmationComponent } from './itinerary-confirmation.component';

describe('ItineraryConfirmationComponent', () => {
  let component: ItineraryConfirmationComponent;
  let fixture: ComponentFixture<ItineraryConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItineraryConfirmationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ItineraryConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
