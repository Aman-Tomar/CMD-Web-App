import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientDetailComponent } from './patient-detail.component';
import { PatientService } from '../../services/patient/patient.service';
import { CommonService } from '../../services/common.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Patient } from '../../models/Patients/patient.model';

describe('PatientDetailComponent', () => {
  let component: PatientDetailComponent;
  let fixture: ComponentFixture<PatientDetailComponent>;
  let patientServiceSpy: jasmine.SpyObj<PatientService>;
  let commonServiceSpy: jasmine.SpyObj<CommonService>;

  beforeEach(async () => {
    const patientSpy = jasmine.createSpyObj('PatientService', ['getPatientById', 'getDoctors', 'getClinics']);
    const commonSpy = jasmine.createSpyObj('CommonService', ['detectMimeTypeAndPrepend']);

    await TestBed.configureTestingModule({
      imports: [PatientDetailComponent],
      providers: [
        { provide: PatientService, useValue: patientSpy },
        { provide: CommonService, useValue: commonSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
        DatePipe
      ]
    }).compileComponents();

    patientServiceSpy = TestBed.inject(PatientService) as jasmine.SpyObj<PatientService>;
    commonServiceSpy = TestBed.inject(CommonService) as jasmine.SpyObj<CommonService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load patient details on init', () => {
    const mockDoctors = { data: [{ doctorId: 1, firstName: 'Dr. Smith' }] };
    const mockClinics = [{ id: 1, name: 'Clinic A' }];
    const mockPatient: Patient = {
      patientId: 1,
      patientName: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      age: 30,
      dob: '1990-01-01',
      gender: 'Male',
      preferredStartTime: '2023-01-01T09:00:00',
      preferredEndTime: '2023-01-01T17:00:00',
      createdDate: '2023-01-01',
      createdBy: 1,
      lastModifiedDate: '2023-01-01',
      lastModifiedBy: 1,
      preferredClinicId: 1,
      preferredDoctorId: 1,
      image: 'base64image',
      patientAddressId: 1,
      streetAddress: '123 Main St',
      city: 'Anytown',
      state: 'ST',
      country: 'Country',
      zipCode: '12345',
      patientGuardianId: null,
      patientGuardianName: null,
      patientGuardianPhoneNumber: null,
      patientGuardianRelationship: null
    };

    patientServiceSpy.getDoctors.and.returnValue(of(mockDoctors));
    patientServiceSpy.getClinics.and.returnValue(of(mockClinics));
    patientServiceSpy.getPatientById.and.returnValue(of(mockPatient));
    commonServiceSpy.detectMimeTypeAndPrepend.and.returnValue('data:image/jpeg;base64,base64image');

    fixture.detectChanges(); // This calls ngOnInit

    expect(patientServiceSpy.getDoctors).toHaveBeenCalled();
    expect(patientServiceSpy.getClinics).toHaveBeenCalled();
    expect(patientServiceSpy.getPatientById).toHaveBeenCalledWith(1);
    expect(commonServiceSpy.detectMimeTypeAndPrepend).toHaveBeenCalledWith('base64image');

    expect(component.patient).toBeTruthy();
    expect(component.patient?.patientName).toBe('John Doe');
    expect(component.patient?.preferredDoctorName).toBe('Dr. Smith');
    expect(component.patient?.preferredClinicName).toBe('Clinic A');
    expect(component.patient?.preferredStartTime).toBe('09:00');
    expect(component.patient?.preferredEndTime).toBe('17:00');
    expect(component.patient?.image).toBe('data:image/jpeg;base64,base64image');
  });

  it('should handle errors when loading patient details', (done) => {
    patientServiceSpy.getDoctors.and.returnValue(throwError(() => new Error('Failed to load doctors')));
    patientServiceSpy.getClinics.and.returnValue(throwError(() => new Error('Failed to load clinics')));
    patientServiceSpy.getPatientById.and.returnValue(throwError(() => new Error('Failed to load patient')));

    spyOn(console, 'error');

    component.ngOnInit();

    setTimeout(() => {
      expect(console.error).toHaveBeenCalledWith('Error loading doctors and clinics:', jasmine.any(Error));
      done();
    });
  });
});
