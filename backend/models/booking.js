const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    name: String,
    phoneNumber: String,
    seats: [String], // ✅ Changed from Number to String
    movie: String,
    date: { type: String, required: true },
    year: String,
    rollNumber: String,
    // time: { type: String, required: true },
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;