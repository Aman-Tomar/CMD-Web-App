import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentFilterComponent } from './appointment-filter-status.component';

describe('AppointmentFilterStatusComponent', () => {
  let component: AppointmentFilterComponent;
  let fixture: ComponentFixture<AppointmentFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
