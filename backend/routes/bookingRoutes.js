const express = require('express');
const router = express.Router();
const moment = require('moment-timezone');
const Booking = require('../models/booking');

// 📌 GET request to fetch booked seats for a specific movie
router.get('/booked-seats/:movie', async (req, res) => {
    const { movie } = req.params;
    try {
        const bookings = await Booking.find({ movie });
        const bookedSeats = bookings.flatMap(booking => booking.seats);

        const totalSeats = 132; // Updated total seat count to 132 (11 rows * 6 columns * 2 boxes)
        const isFullyBooked = bookedSeats.length >= totalSeats;

        res.status(200).json({ bookedSeats, isFullyBooked });
    } catch (error) {
        console.error('❌ Error fetching booked seats:', error);
        res.status(500).json({ message: '❌ Error fetching booked seats' });
    }
});

// 📌 POST request to create a new booking
router.post('/', async (req, res) => {
    try {
        const { name, phone, seatNumbers, movie, rollNumber, year, paymentId } = req.body;

        if (!name || !phone || !seatNumbers || !movie || !rollNumber || !year || !paymentId) {
            return res.status(400).json({ message: '❌ Missing required fields' });
        }

        const formattedDate = moment().tz("Asia/Kolkata").format("DD-MM-YYYY hh:mm A");

        const booking = new Booking({
            name,
            phoneNumber: phone,
            seats: seatNumbers,
            movie,
            date: formattedDate,
            rollNumber,
            year,
            paymentId
        });

        await booking.save();

        res.status(201).json({ success: true, message: '✅ Booking successful!' });
    } catch (error) {
        res.status(500).json({ message: '❌ Error booking tickets' });
    }
});

module.exports = router;
