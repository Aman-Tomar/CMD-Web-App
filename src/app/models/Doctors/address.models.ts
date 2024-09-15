import { IDoctor } from "./doctor.models";

export interface IAddress {
    addressId:number,
    street:string,
    city:string,
    state:string,
    country:string,
    zipCode:string,
    createdDate:Date,
    createdBy:string,
    lastModified:Date,
    lastModifiedBy:string,
    doctorId:number,
    doctor:IDoctor
}