import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import HomePage from "./home/HomePage";
import BookingPage from "./booking/BookingPage";
import ManagePage from "./manage/ManagePage";

import "./App.css";

function App() {

  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const addCustomer = () => {

  }


  return (
    <BrowserRouter >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/manage" element={<ManagePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
