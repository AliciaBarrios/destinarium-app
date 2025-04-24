import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step3ExtrasComponent } from './step3-extras.component';

describe('Step3ExtrasComponent', () => {
  let component: Step3ExtrasComponent;
  let fixture: ComponentFixture<Step3ExtrasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Step3ExtrasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Step3ExtrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
