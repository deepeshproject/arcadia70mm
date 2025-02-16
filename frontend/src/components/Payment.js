import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./payment.css";

const Payment = () => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [roll, setRoll] = useState("");
    const [year, setYear] = useState("");

    const location = useLocation();
    const navigate = useNavigate();
    const selectedSeats = location.state?.selectedSeats || [];
    const selectedMovie = location.state?.selectedMovie || "";

    console.log("📌 Payment Page Loaded with:", selectedSeats, selectedMovie);

    const handlePayment = async () => {
        try {
            console.log("🔑 Using Razorpay Key:", process.env.REACT_APP_RAZORPAY_KEY_ID);
            
            const response = await axios.post("https://arcadia70mm-9vle.onrender.com/api/payment/order", {
                amount: selectedSeats.length * 60,
            });

            const order = response.data;

            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                order_id: order.id,
                name: "Movie Ticket Booking",
                description: `Booking for ${selectedMovie}`,
                handler: async function (paymentResponse) {
                    console.log("✅ Payment Successful:", paymentResponse);

                    try {
                        const bookingData = {
                            name,
                            phone,
                            seatNumbers: selectedSeats,
                            movie: selectedMovie,
                            rollNumber: roll,
                            year,
                            paymentId: paymentResponse.razorpay_payment_id,
                        };

                        const bookingResponse = await axios.post("https://arcadia70mm-9vle.onrender.com/api/bookings", bookingData);

                        if (bookingResponse.data.success) {
                            const bookingUrl = `/qr-confirmation?seats=${selectedSeats.join(",")}&name=${encodeURIComponent(name)}&phone=${phone}&show=${selectedMovie}`;
                            window.open(bookingUrl, "_blank");
                            navigate("/");
                        } else {
                            alert("❌ Booking failed. Please try again.");
                        }
                    } catch (error) {
                        console.error("❌ Error booking seats:", error.response?.data || error.message);
                        alert("Failed to book seats. Please try again.");
                    }
                },
                prefill: { name, contact: phone, roll, year },
                theme: { color: "#F37254" },
                modal: {
                    ondismiss: function () {
                        alert("❌ Payment failed or cancelled");
                    },
                },
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } catch (error) {
            console.error("❌ Error creating payment order:", error);
            alert("Error processing payment");
        }
    };

    return (
        <div className="payment-container">
            <h3>Enter Your Details</h3>
            <form
                className="form-pay"
                onSubmit={(e) => {
                    e.preventDefault();
                    handlePayment();
                }}
            >
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={10} minLength={10} required />
                <input type="text" placeholder="Roll Number" value={roll} onChange={(e) => setRoll(e.target.value)} required />
                <input type="number" placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} required />
                <button type="submit">Pay Now</button>
            </form>
        </div>
    );
};

export default Payment;