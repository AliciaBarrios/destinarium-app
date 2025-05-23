import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointsOfInterestComponent } from './points-of-interest.component';

describe('PointsOfInterestComponent', () => {
  let component: PointsOfInterestComponent;
  let fixture: ComponentFixture<PointsOfInterestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PointsOfInterestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PointsOfInterestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
