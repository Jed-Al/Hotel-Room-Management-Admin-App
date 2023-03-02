import { MongoClient, Collection, MongoServerError, Db } from "mongodb";
import { Booking } from "../models/Booking";

export const collections: {
    bookings?: Collection<Booking>;
} = {};

export async function connectToDatabase(uri: string) {
    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("Hotel");

    const bookingsCollection = db.collection<Booking>("bookings");
    collections.bookings = bookingsCollection;
}
