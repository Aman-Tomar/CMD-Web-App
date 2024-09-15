import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDoctorScheduleComponent } from './add-doctor-schedule.component';

describe('AddDoctorComponent', () => {
  let component: AddDoctorScheduleComponent;
  let fixture: ComponentFixture<AddDoctorScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDoctorScheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDoctorScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});