import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentFilterStatusComponent } from './appointment-filter-status.component';

describe('AppointmentFilterStatusComponent', () => {
  let component: AppointmentFilterStatusComponent;
  let fixture: ComponentFixture<AppointmentFilterStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentFilterStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentFilterStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
