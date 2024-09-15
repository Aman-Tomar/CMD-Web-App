export interface IDoctorSchedule {
   doctorScheduleId: number,
   weekday: string,
   startTime: string,
   endTime: string,
   status: boolean,
   doctorId: number,
}

export interface IScheduleResponse {
   data: IDoctorSchedule[];
   page: number;
   pageSize: number;
   totalItems: number;
   totalPages: number;
 }