import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchAuthComponent } from './switch-auth.component';

describe('SwitchAuthComponent', () => {
  let component: SwitchAuthComponent;
  let fixture: ComponentFixture<SwitchAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SwitchAuthComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SwitchAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
