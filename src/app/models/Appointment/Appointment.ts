export interface IAppointment
{
    id:number,
    
purposeOfVisit:string,
    date:string,
    time:string,
    email:string,
    phone:string,
    status:string,
    message:string,
    createdBy:string,
    createdDate?:string,
    lastModifiedBy:string,
    lastModifiedDate?:string,
    patientId:number,
    doctorId:number


}