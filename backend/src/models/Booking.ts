import { ObjectId } from "mongodb";

export interface Booking {
    name: string;
    email : string;
    roomNumber : number;
    roomType : string;
    startTime : number;
    endTime : number;
    _id?: ObjectId;
}
