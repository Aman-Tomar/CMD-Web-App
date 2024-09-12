import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDoctorScheduleComponent } from './edit-doctor-schedule.component';

describe('EditDoctorScheduleComponent', () => {
  let component: EditDoctorScheduleComponent;
  let fixture: ComponentFixture<EditDoctorScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDoctorScheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDoctorScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
