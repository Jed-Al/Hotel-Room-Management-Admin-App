import express, { Request, Response, Router } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database";
import { Booking } from "../models/Booking";
import { HOTEL_CONFIG } from "../config/constants";

export const bookingsRouter = Router();
bookingsRouter.use(express.json());

/*
    * GET /bookings
    * Returns all bookings in the database
*/
bookingsRouter.get("/", async (_req: Request, res: Response) => {
    try {
        const bookings = await collections.bookings.find({}).toArray();
        res.status(200).send(bookings);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

/*
    * GET /bookings/:id
    * Returns a single link by ID
    * Returns 404 if the link is not found
*/
bookingsRouter.get("/:id", async (req: Request, res: Response) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new ObjectId(id) };
        const link = await collections.bookings.findOne(query);

        if (link) {
            res.status(200).send(link);
        } else {
            res.status(404).send({ message: "Link does not exist" });
        }

    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

/*
    * POST /bookings
    * Creates a new link
    * Returns 201 if the link is created
    * Returns 400 if the link body is invalid
*/
bookingsRouter.post("/", async (req: Request, res: Response) => {
    try {

        const customer: Booking = req.body

        const alreadyBookedRoomsInThisType = await collections.bookings.find({
            roomType: customer.roomType
        }).toArray();

        const roomType = HOTEL_CONFIG.find(config => config.roomType == customer.roomType);

        if (roomType == undefined) {
            res.status(500).send({ message: "Invalid room type" })
            return;
        }

        if (alreadyBookedRoomsInThisType.length >= roomType.roomQuantity) {
            res.status(401).send({ message: "No rooms available in this category" })
            return;
        }

        const existingCustomer = await collections.bookings.findOne({
            roomNumber: customer.roomNumber,
            roomType: customer.roomType
        });

        if (existingCustomer) {
            if (existingCustomer.endTime > customer.startTime
                || existingCustomer.startTime < customer.endTime) {
                res.status(403).send({ message: "This room is already booked" });
                return;
            }
        }

        const result = await collections.bookings.insertOne(customer);

        if (result.acknowledged) {
            res.status(201).send({ message: result.insertedId });
        } else {
            res.status(500).send({ message: "Failed to book room for customer" });
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

/*
    * PUT /bookings/:id
    * Updates a link by ID
    * Returns 200 if the link is updated
    * Returns 404 if the link is not found
    * Returns 304 if the link is not updated
*/
bookingsRouter.put("/:id", async (req: Request, res: Response) => {
    try {
        const id = req?.params?.id;
        const customer = req.body;

        const existingBooking = await collections.bookings.findOne({
            _id: new ObjectId(id)
        });

        if (!existingBooking) {
            res.status(404).send({ message: "The booking does not exist!" });
            return;
        }

        const query = { _id: new ObjectId(id) };
        const result = await collections.bookings.updateOne(query, { $set: { customer } });

        if (result && result.matchedCount) {
            res.status(200).send({ message: "Updated an link" });
        } else if (!result.matchedCount) {
            res.status(404).send({ message: "Failed to find link" });
        } else {
            res.status(304).send({ message: "Failed to update link" });
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

/*
    * DELETE /bookings/:id
    * Deletes a link by ID
    * Returns 202 if the link is deleted
    * Returns 404 if the link is not found
*/
bookingsRouter.delete("/:id", async (req: Request, res: Response) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new ObjectId(id) };
        const result = await collections.bookings.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send({ message: "Removed booking" });
        } else if (!result) {
            res.status(400).send({ message: "Failed to remove booking" });
        } else if (!result.deletedCount) {
            res.status(404).send({ message: "Failed to find booking" });
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});