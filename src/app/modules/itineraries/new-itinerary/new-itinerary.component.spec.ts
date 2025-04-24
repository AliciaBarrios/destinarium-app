import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewItineraryComponent } from './new-itinerary.component';

describe('NewItineraryComponent', () => {
  let component: NewItineraryComponent;
  let fixture: ComponentFixture<NewItineraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewItineraryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewItineraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
