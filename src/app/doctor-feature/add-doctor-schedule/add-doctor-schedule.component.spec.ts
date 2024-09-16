import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AddDoctorScheduleComponent } from './add-doctor-schedule.component';
import { ReactiveFormsModule } from '@angular/forms'; // Importing forms module for form-related functionalities
import { DoctorService } from '../../services/doctor/doctor.service';
import { DoctorScheduleService } from '../../services/doctor/doctor-schedule.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs'; // RxJS utilities to simulate observable behavior

describe('AddDoctorComponent', () => {
  let component: AddDoctorScheduleComponent;
  let fixture: ComponentFixture<AddDoctorScheduleComponent>;
  let mockDoctorService: jasmine.SpyObj<DoctorService>; // Mocked version of the DoctorService
  let mockDoctorScheduleService: jasmine.SpyObj<DoctorScheduleService>; // Mocked version of the DoctorScheduleService
  let mockRouter: jasmine.SpyObj<Router>; // Mocked Router for navigation

  beforeEach(async () => {
    // Creating spies (mocks) for the methods that will be used
    mockDoctorService = jasmine.createSpyObj('DoctorService', ['getAllDoctors']);
    mockDoctorScheduleService = jasmine.createSpyObj('DoctorScheduleService', ['createSchedule']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      // Setting up the testing module for the component
      imports: [AddDoctorScheduleComponent, ReactiveFormsModule], // Import ReactiveFormsModule for form functionality
      providers: [
        { provide: DoctorService, useValue: mockDoctorService }, // Providing the mock DoctorService
        { provide: DoctorScheduleService, useValue: mockDoctorScheduleService }, // Providing the mock DoctorScheduleService
        { provide: Router, useValue: mockRouter } // Providing the mock Router for navigation
      ]
    }).compileComponents(); // Compiling the test module

    fixture = TestBed.createComponent(AddDoctorScheduleComponent); // Creating an instance of the component
    component = fixture.componentInstance; // Accessing the component's instance
  });

  // Test case to ensure the component is created successfully
  it('should create', () => {
    expect(component).toBeTruthy(); // The component should exist after creation
  });

  // Test case to check if doctors are loaded correctly on component initialization
  it('should load doctors on init', fakeAsync(() => {
    // Mock response from DoctorService's getAllDoctors method
    const mockDoctors = {
      data: [{ doctorId: 1, firstName: 'John', lastName: 'Doe', doctorAddress: { city: 'New York' } }],
      totalPages: 1
    };
    mockDoctorService.getAllDoctors.and.returnValue(of(mockDoctors)); // Simulate an observable returning doctor data

    component.ngOnInit(); // Trigger ngOnInit lifecycle hook
    tick(); // Simulate asynchronous behavior

    // Assert that doctors array is populated with the mock data
    expect(component.doctors.length).toBe(1);
    expect(component.doctors[0].city).toBe('New York'); // Checking if the doctor's city is set correctly
  }));

  // Test case to verify error handling during form submission
  it('should handle error on form submission', fakeAsync(() => {
    // Setting valid form data
    component.scheduleForm.setValue({
      clinicId: 1,
      weekDay: 'Monday',
      startTime: '09:00',
      endTime: '17:00',
      status: true,
      doctorId: 1
    });

    // Simulate the createSchedule method returning an error
    mockDoctorScheduleService.createSchedule.and.returnValue(throwError(() => new Error('API Error')));

    component.onSubmit(); // Call the form submission method
    tick(); // Simulate asynchronous behavior

    // Assert that an error message is set in the component
    expect(component.message).toBe('Error occurred while creating the schedule.');
    expect(component.success).toBe(false); // Ensure that the success flag is set to false
  }));

  // Test case to ensure the form is not submitted when invalid
  it('should not submit if form is invalid', () => {
    // Set invalid form data (empty or null fields)
    component.scheduleForm.setValue({
      clinicId: null,
      weekDay: '',
      startTime: '',
      endTime: '',
      status: null,
      doctorId: null
    });

    component.onSubmit(); // Call the form submission method

    // Assert that the service method is not called since the form is invalid
    expect(mockDoctorScheduleService.createSchedule).not.toHaveBeenCalled();
  });
});