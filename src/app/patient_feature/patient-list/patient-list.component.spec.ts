import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientListComponent } from './patient-list.component';
import { PatientService } from '../../services/patient/patient.service';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Patient, PatientResponse } from '../../models/Patients/patient.model';
import { ActivatedRoute } from '@angular/router';

describe('PatientListComponent', () => {
  let component: PatientListComponent;
  let fixture: ComponentFixture<PatientListComponent>;
  let patientServiceSpy: jasmine.SpyObj<PatientService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('PatientService', ['getPatients']);
    const activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: () => '1'
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [PatientListComponent, NoopAnimationsModule],
      providers: [
        { provide: PatientService, useValue: spy },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    patientServiceSpy = TestBed.inject(PatientService) as jasmine.SpyObj<PatientService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load patients on init', () => {
    const mockPatients: PatientResponse = {
      items: [{ patientId: 1, patientName: 'John Doe', email: 'john@example.com', phone: '1234567890', age: 30, dob: '1990-01-01', gender: 'Male', preferredStartTime: null, preferredEndTime: null, createdDate: '2023-01-01', createdBy: 1, lastModifiedDate: '2023-01-01', lastModifiedBy: 1, preferredClinicId: null, patientAddressId: 1, streetAddress: '123 Main St', city: 'Anytown', state: 'ST', country: 'Country', zipCode: '12345', preferredDoctorId: null, patientGuardianId: null, patientGuardianName: null, patientGuardianPhoneNumber: null, patientGuardianRelationship: null }],
      totalCountOfPatients: 1,
      pageNumber: 1,
      pageSize: 20
    };
    patientServiceSpy.getPatients.and.returnValue(of(mockPatients));

    fixture.detectChanges(); // This calls ngOnInit

    expect(patientServiceSpy.getPatients).toHaveBeenCalledWith(1, 20);
    expect(component.patients).toEqual(mockPatients.items);
    expect(component.totalPatients).toBe(1);
  });

  it('should change page and reload patients', () => {
    const mockPatients: PatientResponse = {
      items: [{ patientId: 2, patientName: 'Jane Doe', email: 'jane@example.com', phone: '0987654321', age: 25, dob: '1995-01-01', gender: 'Female', preferredStartTime: null, preferredEndTime: null, createdDate: '2023-01-01', createdBy: 1, lastModifiedDate: '2023-01-01', lastModifiedBy: 1, preferredClinicId: null, patientAddressId: 2, streetAddress: '456 Elm St', city: 'Othertown', state: 'ST', country: 'Country', zipCode: '67890', preferredDoctorId: null, patientGuardianId: null, patientGuardianName: null, patientGuardianPhoneNumber: null, patientGuardianRelationship: null }],
      totalCountOfPatients: 1,
      pageNumber: 2,
      pageSize: 20
    };
    patientServiceSpy.getPatients.and.returnValue(of(mockPatients));

    component.onPageChange(2);

    expect(patientServiceSpy.getPatients).toHaveBeenCalledWith(2, 20);
    expect(component.currentPage).toBe(2);
    expect(component.patients).toEqual(mockPatients.items);
  });

  it('should toggle patient selection', () => {
    const patient: Patient = { patientId: 1, patientName: 'John Doe', email: 'john@example.com', phone: '1234567890', age: 30, dob: '1990-01-01', gender: 'Male', preferredStartTime: null, preferredEndTime: null, createdDate: '2023-01-01', createdBy: 1, lastModifiedDate: '2023-01-01', lastModifiedBy: 1, preferredClinicId: null, patientAddressId: 1, streetAddress: '123 Main St', city: 'Anytown', state: 'ST', country: 'Country', zipCode: '12345', preferredDoctorId: null, patientGuardianId: null, patientGuardianName: null, patientGuardianPhoneNumber: null, patientGuardianRelationship: null };
    component.selectPatient(patient);
    expect(component.selectedPatient).toEqual(patient);

    component.selectPatient(patient);
    expect(component.selectedPatient).toBeNull();
  });

  it('should sort patients', () => {
    component.patients = [
      { patientId: 1, patientName: 'John', email: 'john@example.com', phone: '1234567890', age: 30, dob: '1990-01-01', gender: 'Male', preferredStartTime: null, preferredEndTime: null, createdDate: '2023-01-01', createdBy: 1, lastModifiedDate: '2023-01-01', lastModifiedBy: 1, preferredClinicId: null, patientAddressId: 1, streetAddress: '123 Main St', city: 'Anytown', state: 'ST', country: 'Country', zipCode: '12345', preferredDoctorId: null, patientGuardianId: null, patientGuardianName: null, patientGuardianPhoneNumber: null, patientGuardianRelationship: null },
      { patientId: 2, patientName: 'Alice', email: 'alice@example.com', phone: '0987654321', age: 25, dob: '1995-01-01', gender: 'Female', preferredStartTime: null, preferredEndTime: null, createdDate: '2023-01-01', createdBy: 1, lastModifiedDate: '2023-01-01', lastModifiedBy: 1, preferredClinicId: null, patientAddressId: 2, streetAddress: '456 Elm St', city: 'Othertown', state: 'ST', country: 'Country', zipCode: '67890', preferredDoctorId: null, patientGuardianId: null, patientGuardianName: null, patientGuardianPhoneNumber: null, patientGuardianRelationship: null }
    ];

    component.sortBy('patientName');
    expect(component.patients[0].patientName).toBe('Alice');
    expect(component.patients[1].patientName).toBe('John');

    component.sortBy('patientName');
    expect(component.patients[0].patientName).toBe('John');
    expect(component.patients[1].patientName).toBe('Alice');
  });
});
