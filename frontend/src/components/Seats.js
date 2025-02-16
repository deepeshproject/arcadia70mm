import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Seats.css';

const SeatSelection = () => {
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [bookedSeats, setBookedSeats] = useState([]);
    const [blockedSeats, setBlockedSeats] = useState([]);
    const [isFullyBooked, setIsFullyBooked] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const selectedMovie = location.state?.selectedMovie || "";

    useEffect(() => {
        const fetchSeats = async () => {
            try {
                if (!selectedMovie) return;
    
                const response = await axios.get(`https://arcadia70mm-9vle.onrender.com/api/bookings/booked-seats/${selectedMovie}`);
                
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
        const interval = setInterval(fetchSeats, 5000);
        return () => clearInterval(interval);
    }, [selectedMovie]);

    const handleSeatClick = (seat) => {
        if (bookedSeats.includes(seat) || blockedSeats.includes(seat) || isFullyBooked) {
            alert('This seat is unavailable');
            return;
        }
        setSelectedSeats((prev) =>
            prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
        );
    };

    const handleProceed = async () => {
        if (selectedSeats.length === 0) {
            alert('Please select at least one seat');
            return;
        }
    
        try {
            await axios.post('https://arcadia70mm-9vle.onrender.com/api/bookings/block-seats', { 
                movie: selectedMovie,
                seats: selectedSeats,
            });

            console.log("✅ Proceeding to payment with:", selectedSeats, selectedMovie);
            navigate('/payment', { state: { selectedSeats, selectedMovie } });
        } catch (error) {
            console.error("❌ Error blocking seats:", error);
        }
    };

    return (
        <div className="seats-page">
            <div className="seats-container">
                <button
                    className={`proceed-btn ${isFullyBooked ? 'disabled' : ''}`}
                    onClick={handleProceed}
                    disabled={selectedSeats.length === 0 || isFullyBooked}
                >
                    {isFullyBooked ? 'Fully Booked' : `Pay Rs.${selectedSeats.length * 60}`}
                </button>
            </div>
        </div>
    );
};

export default SeatSelection;
