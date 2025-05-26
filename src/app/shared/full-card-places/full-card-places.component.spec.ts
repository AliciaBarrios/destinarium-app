import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullCardPlacesComponent } from './full-card-places.component';

describe('FullCardComponent', () => {
  let component: FullCardPlacesComponent;
  let fixture: ComponentFixture<FullCardPlacesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FullCardPlacesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FullCardPlacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
