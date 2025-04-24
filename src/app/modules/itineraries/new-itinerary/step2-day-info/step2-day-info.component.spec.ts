import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step2DayInfoComponent } from './step2-day-info.component';

describe('Step2DayInfoComponent', () => {
  let component: Step2DayInfoComponent;
  let fixture: ComponentFixture<Step2DayInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Step2DayInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Step2DayInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
