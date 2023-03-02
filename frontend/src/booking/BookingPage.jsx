import { Form, FormGroup, Label, Input, Card, Button } from "reactstrap"
import { useEffect, useState } from 'react';
import { API_URL } from "../constants";
import axios from "axios";

import "./BookingPage.css"

export default function BookingPage() {

    const rooms = [
        {
            roomType: "A",
            roomQuantity: 2,
            roomChargePerHour: 100
        },
        {
            roomType: "B",
            roomQuantity: 3,
            roomChargePerHour: 80
        },
        {
            roomType: "C",
            roomQuantity: 5,
            roomChargePerHour: 50
        }
    ]

    const [name, setName] = useState("");
    const [mail, setMail] = useState("");

    const [roomNumber, setRoomNumber] = useState("101");
    const [roomType, setRoomType] = useState(rooms[0].roomType);

    const [startTime, setStartTime] = useState("");
    const [startDate, setStartDate] = useState("");

    const [endDate, setEndDate] = useState("");
    const [endTime, setEndTime] = useState("");

    const [startEpoch, setStartEpoch] = useState(0);
    const [endEpoch, setEndEpoch] = useState(0);

    useEffect(() => {
        console.log("startTime=" + startTime + ", endTime=" + endTime + ", startDate=" + startDate + ", endDate=" + endDate + ", roomType=" + roomType + ", roomNumber=" + roomNumber + ", name=" + name + ", mail=" + mail + "");
        if (startTime === "" || endTime === "" || startDate === "" || endDate === "") {
            setPrice("Please select a room type and time");
            return;
        }
        const startEpoch = convertDateToEpoch(startDate) + convertTimeToEpoch(startTime);
        const endEpoch = convertDateToEpoch(endDate) + convertTimeToEpoch(endTime);
        setStartEpoch(startEpoch);
        setEndEpoch(endEpoch);
        const duration = endEpoch - startEpoch;
        const hours = Math.floor(duration / 3600);
        const rate = rooms.find(room => room.roomType == roomType).roomChargePerHour;
        setPrice(`Price: ₹${hours * rate}`);
    }, [roomType, startTime, endTime, startDate, endDate])

    const [price, setPrice] = useState("Please select a room type and time");

    const addDetails = () => {
        const booking = {
            name: name,
            email: mail,
            roomNumber: roomNumber,
            roomType: roomType,
            startTime: startEpoch,
            endTime: endEpoch
        }
        axios.post(`${API_URL}/api/v1/booking/`, booking)
            .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    alert("Booking successful");
                } else {
                    alert("Booking failed");
                }
            })
    }

    return (
        <div className="form-container">
            <Card className="add-customer">
                <h3>Book a Room</h3>
                <Form>
                    <FormGroup>
                        <Label>Email</Label>
                        <Input
                            placeholder="Enter your email address"
                            type="email"
                            onChange={e => setMail(e.target.value)}
                            value={mail}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Name</Label>
                        <Input
                            placeholder="Enter your full name"
                            type="text"
                            onChange={e => setName(e.target.value)}
                            value={name}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Start time</Label>
                        <Input name="date" placeholder="date placeholder" type="date" onChange={e => setStartDate(e.target.value)} />
                        <Input name="time" placeholder="time placeholder" type="time" onChange={e => setStartTime(e.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <Label>End time</Label>
                        <Input name="date" placeholder="date placeholder" type="date" onChange={e => setEndDate(e.target.value)} />
                        <Input name="time" placeholder="time placeholder" type="time" onChange={e => setEndTime(e.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <Label>Room type</Label>
                        <Input
                            type="select"
                            onChange={e => setRoomType(e.target.value)}
                            value={roomType}>
                            {rooms.map(room =>
                                <option key={room.roomType}>{room.roomType}</option>
                            )}
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label>Select</Label>
                        <Input
                            type="select"
                            onChange={e => setRoomNumber(e.target.value)}
                            value={roomNumber}>
                            {
                                Array.from(
                                    { length: rooms.find(room => room.roomType == roomType).roomQuantity },
                                    (_, index) => {
                                        var roomPrefix = 0;
                                        if (roomType === "A") {
                                            roomPrefix = 100;
                                        }
                                        if (roomType == "B") {
                                            roomPrefix = 200;
                                        }
                                        if (roomType == "C") {
                                            roomPrefix = 300;
                                        }
                                        let roomNumber = (index + 1) + roomPrefix;
                                        return <option key={index} >{roomNumber}</option>
                                    }
                                )
                            }

                        </Input>
                    </FormGroup>
                    <h5>{price}</h5>
                    <Button block color="secondary" outline onClick={addDetails}>Book Room</Button>
                </Form>
            </Card>
        </div>
    )
}

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000)
}


function convertDateToEpoch(dateString) {
    const dateParts = dateString.split("-");
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const day = parseInt(dateParts[2], 10);
    return Date.UTC(year, month, day) / 1000;
}


function convertTimeToEpoch(timeString) {
    const timeParts = timeString.split(":");
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    return (hours * 3600 + minutes * 60); // seconds since midnight
}
