import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItinerarySummeryComponent } from './itinerary-summery.component';

describe('ItinerarySummeryComponent', () => {
  let component: ItinerarySummeryComponent;
  let fixture: ComponentFixture<ItinerarySummeryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItinerarySummeryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ItinerarySummeryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
