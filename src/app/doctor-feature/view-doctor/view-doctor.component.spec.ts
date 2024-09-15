import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { ViewDoctorComponent } from './view-doctor.component';
import { DoctorService } from '../../services/doctor/doctor.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('ViewDoctorComponent', () => {
  let component: ViewDoctorComponent;
  let fixture: ComponentFixture<ViewDoctorComponent>;
  let httpTestingController: HttpTestingController;
  let doctorService: DoctorService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDoctorComponent, HttpClientTestingModule],
      providers: [
        DoctorService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1', // Mocking route parameter
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewDoctorComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    doctorService = TestBed.inject(DoctorService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Doctor data loading', () => {
    const mockResponse = {
      page: 1,
      pageSize: 10,
      totalItems: 7,
      totalPages: 1,
      data: [
        {
          doctorId: 1,
          firstName: "Rajesh",
          lastName: "Kumar",
          email: "rajesh.kumar@gmail.com",
          phoneNo: "+916362919723",
          specialization: "General Medicine",
          profilePicture: null,
          briefDescription: "Experienced in general medicine with over 15 years of practice.",
          experienceInYears: 15,
          dateOfBirth: "1980-05-21T00:00:00",
          gender: "MALE",
          qualification: "MBBS, MD",
          status: true,
          createdAt: "2024-09-13T03:12:51.1794942",
          createdBy: "admin",
          lastModifiedDate: "0001-01-01T00:00:00",
          lastModifiedBy: "admin",
          departmentId: 1,
          clinicId: 5,
          doctorAddress: {
            doctorAddressId: 1,
            street: "123 MG Road",
            city: "Bangalore",
            state: "Karnataka",
            country: "India",
            zipCode: "560001",
            createdDate: "2024-09-13T03:12:51.1801667",
            createdBy: "admin",
            lastModifiedDate: "2024-09-13T03:12:51.1800821",
            lastModifiedBy: "admin",
            doctorId: 1
          }
        }
      ]
    };

    beforeEach(() => {
      spyOn(doctorService, 'getAllDoctors').and.returnValue(of(mockResponse));
    });

    it('should load doctors on initialization', () => {
      component.loadDoctors();

      expect(doctorService.getAllDoctors).toHaveBeenCalled();
      expect(component.doctors.length).toBe(1);
      expect(component.doctors[0].city).toEqual('Bangalore');
      expect(component.totalDoctors).toBe(7);
    });

    it('should handle page size change', () => {
      component.changePage(2);

      expect(component.pageNumber).toBe(2);
      expect(doctorService.getAllDoctors).toHaveBeenCalledWith(2, 10);
    });

    it('should change page', () => {
      component.changePage(2);

      expect(component.pageNumber).toBe(2);
      expect(doctorService.getAllDoctors).toHaveBeenCalled();
    });
  });

  it('should display correct range', () => {
    component.pageSize = 10;
    component.pageNumber = 1;
    component.totalDoctors = 7;

    const range = component.getDisplayRange();

    expect(range).toBe('Showing 1 to 7 of 7 entries');
  });

  it('should toggle the currentDoctorId correctly', () => {
    expect(component.currentDoctorId).toBeNull();

    component.toggleMenu(1);
    expect(component.currentDoctorId).toBe(1);

    component.toggleMenu(1);
    expect(component.currentDoctorId).toBeNull();

    component.toggleMenu(2);
    expect(component.currentDoctorId).toBe(2);
  });
});