import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step1BasicDataComponent } from './step1-basic-data.component';

describe('Step1BasicDataComponent', () => {
  let component: Step1BasicDataComponent;
  let fixture: ComponentFixture<Step1BasicDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Step1BasicDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Step1BasicDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
