import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDoctorScheduleComponent } from './view-doctor-schedule.component';

describe('ViewDoctorScheduleComponent', () => {
  let component: ViewDoctorScheduleComponent;
  let fixture: ComponentFixture<ViewDoctorScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDoctorScheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDoctorScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
