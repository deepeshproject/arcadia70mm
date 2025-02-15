import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Seats.css';

const SeatSelection = () => {
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [bookedSeats, setBookedSeats] = useState([]);
    const [blockedSeats, setBlockedSeats] = useState([]); // Temporarily blocked seats
    const [isFullyBooked, setIsFullyBooked] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const selectedMovie = location.state?.selectedMovie || "";

    // ✅ Define permanently blocked seats (D1 to D12)
    const permanentlyBlockedSeats = [
        'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12'
    ]; 

    // ✅ Fetch booked & blocked seats
    useEffect(() => {
        const fetchSeats = async () => {
            try {
                if (!selectedMovie) return;
    
                const response = await axios.get(`http://localhost:5000/api/bookings/booked-seats/${selectedMovie}`);
                
                if (response.data) {
                    setBookedSeats(response.data.bookedSeats);
                    setBlockedSeats(response.data.blockedSeats || []);
                    setIsFullyBooked(response.data.isFullyBooked);
                }
            } catch (error) {
                console.error('Error fetching seats:', error);
            }
        };

        fetchSeats();
        const interval = setInterval(fetchSeats, 5000); // Refresh every 5 sec
        return () => clearInterval(interval);
    }, [selectedMovie]);

    // ✅ Handle seat selection
    const handleSeatClick = (seat) => {
        if (bookedSeats.includes(seat) || blockedSeats.includes(seat) || permanentlyBlockedSeats.includes(seat) || isFullyBooked) {
            alert('This seat is unavailable');
            return;
        }
        setSelectedSeats((prev) =>
            prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
        );
    };

    // ✅ Proceed to Payment (Blocks seats temporarily)
    const handleProceed = async () => {
        if (selectedSeats.length === 0) {
            alert('Please select at least one seat');
            return;
        }
    
        try {
            await axios.post('http://localhost:5000/api/bookings/block-seats', { 
                movie: selectedMovie,
                seats: selectedSeats,
            });
    
            navigate('/payment', { state: { selectedSeats, selectedMovie } });
        } catch (error) {
            console.error("Error blocking seats:", error);
        }
    };

    // ✅ Generate seat layout
    const generateSeats = () => {
        const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
        const seatsFirstBox = [];
        const seatsSecondBox = [];

        for (let row of rows) {
            for (let col = 1; col <= 6; col++) {
                seatsFirstBox.push(`${row}${col}`);
            }
            for (let col = 7; col <= 12; col++) {
                seatsSecondBox.push(`${row}${col}`);
            }
        }

        return { seatsFirstBox, seatsSecondBox };
    };

    const { seatsFirstBox, seatsSecondBox } = generateSeats();

    return (
        <div className="seats-page">
            <div className="seats-container">
                <div className="book">
                    <div className="screen">
                        <p>Screen</p>
                    </div>
                    <div className="time">
                        {(() => {
                            const timings = {
                                "Am Show": "10 am - 11:30 am",
                                "Mid Show": "12 pm - 1:30 pm",
                                "Pm Show": "2 pm - 3:30 pm",
                            };
                            return timings[selectedMovie] ? <h3>{timings[selectedMovie]}</h3> : null;
                        })()}
                    </div>

                    <div className="prior">
                        <button className="available" disabled /> <h4>Available</h4>
                        <button className="selected" disabled /> <h4>Selected</h4>
                        <button className="booked" disabled /> <h4>Occupied</h4>
                        <button className="block" disabled /> <h4>For Participants</h4>
                    </div>
                    <br />
                    <div className="grid-container">
                        {/* First box (A1 to K6) */}
                        <div className="grid-box">
                            {seatsFirstBox.map((seat) => {
                                if (permanentlyBlockedSeats.includes(seat)) console.log("Blocked Seat:", seat); // ✅ Debugging
                                return (
                                    <button
                                        key={seat}
                                        onClick={() => handleSeatClick(seat)}
                                        className={`seat ${selectedSeats.includes(seat) ? 'selected' : ''} 
                                                    ${bookedSeats.includes(seat) ? 'booked' : ''} 
                                                    ${blockedSeats.includes(seat) ? 'blocked' : ''} 
                                                    ${permanentlyBlockedSeats.includes(seat) ? 'permanently-blocked' : ''}`}  
                                        disabled={bookedSeats.includes(seat) || blockedSeats.includes(seat) || permanentlyBlockedSeats.includes(seat)}
                                    >
                                        {seat}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Second box (A7 to K12) */}
                        <div className="grid-box">
                            {seatsSecondBox.map((seat) => (
                                <button
                                    key={seat}
                                    onClick={() => handleSeatClick(seat)}
                                    className={`seat ${selectedSeats.includes(seat) ? 'selected' : ''} 
                                                ${bookedSeats.includes(seat) ? 'booked' : ''} 
                                                ${blockedSeats.includes(seat) ? 'blocked' : ''} 
                                                ${permanentlyBlockedSeats.includes(seat) ? 'permanently-blocked' : ''}`}  
                                    disabled={bookedSeats.includes(seat) || blockedSeats.includes(seat) || permanentlyBlockedSeats.includes(seat)}
                                >
                                    {seat}
                                </button>
                            ))}
                        </div>
                    </div>
                    <br />
                    <br />
                    <button
                        className={`proceed-btn ${isFullyBooked ? 'disabled' : ''}`}
                        onClick={handleProceed}
                        disabled={selectedSeats.length === 0 || isFullyBooked}
                    >
                        {isFullyBooked ? 'Fully Booked' : `Pay Rs.${selectedSeats.length * 60}`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SeatSelection;
