import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ViewDoctorScheduleComponent } from './view-doctor-schedule.component';
import { DoctorScheduleService } from '../../services/doctor/doctor-schedule.service';
import { DoctorService } from '../../services/doctor/doctor.service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('ViewDoctorScheduleComponent', () => {
  let component: ViewDoctorScheduleComponent;
  let fixture: ComponentFixture<ViewDoctorScheduleComponent>;
  let mockDoctorScheduleService: jasmine.SpyObj<DoctorScheduleService>;
  let mockDoctorService: jasmine.SpyObj<DoctorService>;

  beforeEach(async () => {
    mockDoctorScheduleService = jasmine.createSpyObj('DoctorScheduleService', ['getAllSchedules', 'getDepartmentNameById']);
    mockDoctorService = jasmine.createSpyObj('DoctorService', ['getDoctorById']);

    await TestBed.configureTestingModule({
      imports: [ViewDoctorScheduleComponent, FormsModule],
      providers: [
        { provide: DoctorScheduleService, useValue: mockDoctorScheduleService },
        { provide: DoctorService, useValue: mockDoctorService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewDoctorScheduleComponent);
    component = fixture.componentInstance;
  });

  // Test case: Verify component creation
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test case: Load doctor schedules on component initialization
  it('should load doctor schedules on init', fakeAsync(() => {
    const mockScheduleResponse = {
      data: [{ doctorId: 1, scheduleId: 1 }],
      page: 1,
      pageSize: 10,
      totalItems: 1,
      totalPages: 1
    };
    const mockDoctor = {  
      doctorId: 1,
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: new Date('1980-05-21'),
    email: 'john.doe@example.com',
    gender: 'Male',
    address: '1234 Elm Street',
    country: 'United States',
    state: 'California',
    city: 'Los Angeles',
    zipCode: '90001',
    briefDescription: 'A highly experienced cardiologist with over 15 years of practice.',
    phoneNo: '+1-234-567-8900',
    status: true,
    specialization: 'Cardiology',
    experienceInYears: 15,
    qualification: 'MD, Cardiology',
    departmentId: 2,
    clinicId: 5,
    profilePicture: 'profile-pic-url.jpg' // URL or file path to profile picture
    };
    const mockDepartmentName = 'Cardiology';

    mockDoctorScheduleService.getAllSchedules.and.returnValue(of(mockScheduleResponse));
    mockDoctorService.getDoctorById.and.returnValue(of(mockDoctor));
    mockDoctorScheduleService.getDepartmentNameById.and.returnValue(of(mockDepartmentName));

    fixture.detectChanges();
    tick();

    // Verify that schedules are loaded correctly
    expect(component.doctorSchedules.length).toBe(1);
    expect(component.doctorSchedules[0].doctorFirstName).toBe('John');
   
  }));

  // Test case: Handle page change
  it('should handle page change', () => {
    spyOn(component, 'loadDoctorSchedule');
    component.changePage(2);
    // Verify that page number is updated and schedules are reloaded
    expect(component.pageNumber).toBe(2);
    expect(component.loadDoctorSchedule).toHaveBeenCalled();
  });

  // Test case: Handle page size change
  it('should handle page size change', () => {
    spyOn(component, 'loadDoctorSchedule');
    const event = { target: { value: '20' } } as unknown as Event;
    component.onPageSizeChange(event);
    // Verify that page size is updated, page number is reset, and schedules are reloaded
    expect(component.pageSize).toBe(20);
    expect(component.pageNumber).toBe(1);
    expect(component.loadDoctorSchedule).toHaveBeenCalled();
  });

  // Test case: Calculate correct display range
  it('should calculate correct display range', () => {
    component.pageNumber = 2;
    component.pageSize = 10;
    component.totalScheduless = 25;
    // Verify that the correct range string is returned
    expect(component.getDisplayRange()).toBe('Showing 11 to 20 of 25 entries');
  });

  // Test case: Handle error when loading schedules
  it('should handle error when loading schedules', fakeAsync(() => {
    mockDoctorScheduleService.getAllSchedules.and.returnValue(of({ data: [] }));
    
    fixture.detectChanges();
    tick();

    // Verify that error message is set when no data is available
    expect(component.errorMessage).toBe('No doctor schedule data available.');
  }));
});



  

