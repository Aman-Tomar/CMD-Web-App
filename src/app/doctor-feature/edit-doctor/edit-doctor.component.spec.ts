import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditDoctorComponent } from './edit-doctor.component';
import { DoctorService } from '../../services/doctor/doctor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('EditDoctorComponent', () => {
  let component: EditDoctorComponent;
  let fixture: ComponentFixture<EditDoctorComponent>;
  let doctorService: DoctorService;
  let httpMock: HttpTestingController;
  let mockRouter = { navigate: jasmine.createSpy('navigate') };
  let mockActivatedRoute = {
    paramMap: of({ get: (key: string) => '1' }), // Mock route parameter id
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule],
      declarations: [EditDoctorComponent],
      providers: [
        DoctorService,
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    // Create component instance and service mock
    fixture = TestBed.createComponent(EditDoctorComponent);
    component = fixture.componentInstance;
    doctorService = TestBed.inject(DoctorService);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges(); // Run ngOnInit
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // it('should fetch doctor details on init', () => {
  //   const mockDoctor = {
  //     doctorId: 1,
  //     firstName: 'John',
  //     lastName: 'Doe',
  //     dateOfBirth: '1980-01-01',
  //     email: 'john.doe@example.com',
  //     gender: 'Male',
  //     address: '123 Main St',
  //     country: 'USA',
  //     state: 'California',
  //     city: 'Los Angeles',
  //     zipCode: '90001',
  //     briefDescription: 'An experienced doctor.',
  //     phoneNo: '1234567890',
  //     status: true,
  //     specialization: 'Cardiology',
  //     experienceInYears: 10,
  //     qualification: 'MBBS',
  //     departmentId: 1,
  //     clinicId: 1,
  //     profilePicture: 'profile.jpg',
  //   };

  //   spyOn(doctorService, 'getDoctorById').and.returnValue(of(mockDoctor));

  //   component.ngOnInit();

  //   expect(doctorService.getDoctorById).toHaveBeenCalledWith(1);
  //   expect(component.doctor).toEqual(mockDoctor);
  // });

  it('should handle error when fetching doctor details', () => {
    spyOn(doctorService, 'getDoctorById').and.returnValue(throwError('Error fetching doctor'));

    component.ngOnInit();

    expect(doctorService.getDoctorById).toHaveBeenCalledWith(1);
    expect(component.doctor).toBeUndefined(); // Doctor object should not be populated
  });

  it('should call onCountryChange() and populate states for the selected country', () => {
    component.doctor.country = 'India';
    component.onCountrychange();
    
    expect(component.states.length).toBeGreaterThan(0); // Ensure states are populated
    expect(component.states).toContain('Karnataka'); // Example state
  });

  it('should submit the form with valid data and navigate back to doctor list', () => {
    // Mock doctor details
    component.doctor = {
      doctorId: 1,
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date('1980-01-01'),
      email: 'john.doe@example.com',
      gender: 'Male',
      address: '123 Main St',
      country: 'USA',
      state: 'California',
      city: 'Los Angeles',
      zipCode: '90001',
      briefDescription: 'An experienced doctor.',
      phoneNo: '1234567890',
      status: true,
      specialization: 'Cardiology',
      experienceInYears: 10,
      qualification: 'MBBS',
      departmentId: 1,
      clinicId: 1,
      profilePicture: '',
    };

    const formData = new FormData();
    formData.append('doctorId', '1');
    formData.append('firstName', 'John');
    // Add other fields accordingly...

    spyOn(doctorService, 'editDoctor').and.returnValue(of({ success: true }));

    component.onSubmit();

    expect(doctorService.editDoctor).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/doctor']); // Navigation after success
  });

  it('should handle file selection', () => {
    const mockFile = new File([''], 'profile.jpg', { type: 'image/jpeg' });
    const event = { target: { files: [mockFile] } };

    component.onFileSelected(event);

    expect(component.selectedFile).toEqual(mockFile);
  });

  it('should handle file not selected', () => {
    const event = { target: { files: [] } };

    component.onFileSelected(event);

    expect(component.selectedFile).toBeNull(); // No file should be selected
  });
});
