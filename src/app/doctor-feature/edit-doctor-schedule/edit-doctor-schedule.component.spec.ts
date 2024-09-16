import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EditDoctorScheduleComponent } from './edit-doctor-schedule.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DoctorService } from '../../services/doctor/doctor.service';
import { DoctorScheduleService } from '../../services/doctor/doctor-schedule.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { IDoctorSchedule } from '../../models/Doctors/doctorSchedule.models';

describe('EditDoctorScheduleComponent', () => {
  let component: EditDoctorScheduleComponent;
  let fixture: ComponentFixture<EditDoctorScheduleComponent>;
  let mockDoctorService: jasmine.SpyObj<DoctorService>;
  let mockDoctorScheduleService: jasmine.SpyObj<DoctorScheduleService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    // Create mock services
    mockDoctorService = jasmine.createSpyObj('DoctorService', ['getAllDoctors']);
    mockDoctorScheduleService = jasmine.createSpyObj('DoctorScheduleService', ['getSchedule', 'editSchedule']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {
      paramMap: of({ get: () => '1' })
    };

    // Configure testing module
    await TestBed.configureTestingModule({
      imports: [EditDoctorScheduleComponent, ReactiveFormsModule],
      providers: [
        { provide: DoctorService, useValue: mockDoctorService },
        { provide: DoctorScheduleService, useValue: mockDoctorScheduleService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    // Create component and detect changes
    fixture = TestBed.createComponent(EditDoctorScheduleComponent);
    component = fixture.componentInstance;
  });

  // Test case: Loading doctor schedule on component initialization
  it('should load doctor schedule on init', fakeAsync(() => {
    // Mock schedule data
    const mockSchedule = {
      doctorScheduleId: 1,
      doctorId: 1,
      weekday: 'MONDAY',
      startTime: '09:00:00',
      endTime: '17:00:00',
      status: true
    };
    // Set up mock service responses
    mockDoctorScheduleService.getSchedule.and.returnValue(of(mockSchedule));
    mockDoctorService.getAllDoctors.and.returnValue(of({ data: [], totalPages: 0 }));

    // Trigger ngOnInit
    component.ngOnInit();
    tick();

    // Assert that the schedule is loaded correctly
    expect(component.doctorScheduleId).toBe(1);
    expect(component.scheduleForm.value).toEqual({
      weekDay: 'Monday',
      startTime: '09:00',
      endTime: '17:00',
      status: true,
      doctorId: 1
    });
  }));

  // Test case: Loading doctors on component initialization
  it('should load doctors on init', fakeAsync(() => {
    // Mock doctors data
    const mockDoctors = {
      data: [{ doctorId: 1, firstName: 'John', lastName: 'Doe', doctorAddress: { city: 'New York' } }],
      totalPages: 1
    };
    // Mock schedule data
    const mockSchedule: IDoctorSchedule = {
      doctorScheduleId: 1,
      doctorId: 1,
      weekday: 'MONDAY',
      startTime: '09:00:00',
      endTime: '17:00:00',
      status: true
    };
    // Set up mock service responses
    mockDoctorService.getAllDoctors.and.returnValue(of(mockDoctors));
    mockDoctorScheduleService.getSchedule.and.returnValue(of(mockSchedule));

    // Trigger ngOnInit
    component.ngOnInit();
    tick();

    // Assert that doctors are loaded correctly
    expect(component.doctors.length).toBe(1);
    expect(component.doctors[0].city).toBe('New York');
  }));

  // Test case: Handling error when loading schedule
  it('should handle error when loading schedule', fakeAsync(() => {
    // Set up mock service to return an error
    mockDoctorScheduleService.getSchedule.and.returnValue(throwError(() => new Error('API Error')));
    mockDoctorService.getAllDoctors.and.returnValue(of({ data: [], totalPages: 0 }));

    // Trigger ngOnInit
    component.ngOnInit();
    tick();

    // Assert that error message is set correctly
    expect(component.errorMessage).toBe('Failed to load schedule.');
  }));

  // Test case: Handling error on form submission
  it('should handle error on form submission', fakeAsync(() => {
    // Set up component and form
    component.doctorScheduleId = 1;
    component.scheduleForm.setValue({
      weekDay: 'Monday',
      startTime: '09:00',
      endTime: '17:00',
      status: true,
      doctorId: 1
    });
    // Set up mock service to return an error
    mockDoctorScheduleService.editSchedule.and.returnValue(throwError(() => new Error('API Error')));

    // Trigger form submission
    component.onSubmit();
    tick();

    // Assert that error is handled correctly
    expect(component.message).toBe('Error occurred while creating the schedule.');
    expect(component.success).toBe(false);
  }));

  // Test case: Not submitting if form is invalid
  it('should not submit if form is invalid', () => {
    // Set form to an invalid state
    component.scheduleForm.setValue({
      weekDay: '',
      startTime: '',
      endTime: '',
      status: null,
      doctorId: null
    });

    // Attempt to submit the form
    component.onSubmit();

    // Assert that the editSchedule method was not called
    expect(mockDoctorScheduleService.editSchedule).not.toHaveBeenCalled();
  });
});
