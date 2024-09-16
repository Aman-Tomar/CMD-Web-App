import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DoctorDetailsComponent } from './doctor-details.component';
import { ActivatedRoute } from '@angular/router';
import { DoctorService } from '../../services/doctor/doctor.service';
import { of } from 'rxjs';
import { IDoctor } from '../../models/Doctors/doctor.models';

describe('DoctorDetailsComponent', () => {
  let component: DoctorDetailsComponent;
  let fixture: ComponentFixture<DoctorDetailsComponent>;
  let mockDoctorService: jasmine.SpyObj<DoctorService>; // Mock service to simulate API calls
  let mockActivatedRoute: any; // Mock ActivatedRoute to simulate route parameters

  // Sample mock data for a doctor, used in multiple test cases
  const mockDoctor: IDoctor = {
    doctorId: 1,
    firstName: 'Dr. John Doe',
    specialization: 'Cardiology',
    profilePicture: 'doctor-image.jpg',
    lastName: '',
    dateOfBirth: new Date(),
    email: '',
    gender: '',
    address: '',
    country: '',
    state: '',
    city: '',
    zipCode: '',
    briefDescription: '',
    phoneNo: '',
    status: false,
    experienceInYears: 0,
    qualification: '',
    departmentId: 0,
    clinicId: 0
  };

  beforeEach(async () => {
    // Create spies (mock methods) for the DoctorService
    mockDoctorService = jasmine.createSpyObj('DoctorService', ['getDoctorById']);

    // Simulate the ActivatedRoute with a parameter for 'doctorId'
    mockActivatedRoute = {
      paramMap: of({ get: () => '1' }) // Always return '1' for the doctorId parameter
    };

    await TestBed.configureTestingModule({
      imports: [DoctorDetailsComponent], // Import the component being tested
      providers: [
        { provide: DoctorService, useValue: mockDoctorService }, // Use mock service instead of the real one
        { provide: ActivatedRoute, useValue: mockActivatedRoute } // Use mock ActivatedRoute
      ]
    }).compileComponents(); // Compile the test module

    // Create the component instance and fixture
    fixture = TestBed.createComponent(DoctorDetailsComponent);
    component = fixture.componentInstance;
  });

  // Test case to ensure the component is created successfully
  it('should create', () => {
    expect(component).toBeTruthy(); // Component should exist after creation
  });

  // Test case to verify if doctor details are fetched on component initialization
  it('should fetch doctor details on init', fakeAsync(() => {
    // Mock the return value of getDoctorById to return the mockDoctor object
    mockDoctorService.getDoctorById.and.returnValue(of(mockDoctor));

    fixture.detectChanges(); // Trigger change detection and ngOnInit lifecycle hook
    tick(); // Simulate async operations (resolve observables and promises)

    // Assert that the component correctly reads the doctorId from the route
    expect(component.doctorId).toBe(1);

    // Assert that the doctor details are set correctly in the component
    expect(component.doctor).toEqual(mockDoctor);

    // Ensure that the service method was called with the correct doctorId (1)
    expect(mockDoctorService.getDoctorById).toHaveBeenCalledWith(1);
  }));

  // Test case to verify if the profile picture is correctly returned
  it('should return doctor\'s profile picture when available', () => {
    // Set the component's doctor property with mock data
    component.doctor = mockDoctor;

    // Assert that the getProfilePicture method returns the correct profile picture URL
    expect(component.getProfilePicture()).toBe('doctor-image.jpg');
  });
});
