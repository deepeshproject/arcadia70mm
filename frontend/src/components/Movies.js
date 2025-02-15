import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Movies.css";

const MovieSelect = () => {
    const [movieStatus, setMovieStatus] = useState({
        "Am Show": false,
        "Mid Show": false,
        "Pm Show": false,
    });
    const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
    const [menuActive, setMenuActive] = useState(false);
    const navigate = useNavigate();
    const isMobile = window.matchMedia("(max-width: 600px)").matches;

    useEffect(() => {
        const checkSeatAvailability = async () => {
            try {
                const response1 = await axios.get("http://localhost:5000/api/bookings/booked-seats/Am Show");
                const response2 = await axios.get("http://localhost:5000/api/bookings/booked-seats/Mid Show");
                const response3 = await axios.get("http://localhost:5000/api/bookings/booked-seats/Pm Show");

                setMovieStatus({
                    "Am Show": response1.data.isFullyBooked,
                    "Mid Show": response2.data.isFullyBooked,
                    "Pm Show": response3.data.isFullyBooked,
                });
            } catch (error) {
                console.error("Error fetching seat availability:", error);
            }
        };

        checkSeatAvailability();
    }, []);

    const handleBuyNowClick = (show) => {
        if (!movieStatus[show]) {
            navigate("/seats", { state: { selectedMovie: show } });
        } else {
            alert(`The show ${show} is fully booked. Please choose another show.`);
        }
    };

    const handleNext = () => {
        setCurrentMovieIndex((prevIndex) => (prevIndex + 1) % 3);
    };

    const handlePrev = () => {
        setCurrentMovieIndex((prevIndex) => (prevIndex - 1 + 3) % 3);
    };

    const toggleMenu = () => {
        setMenuActive(!menuActive);
    };

    return (
        <div className="Move">
            <header className="header2">
                <a href="/" className="logo">
                    <img src="./logofinal.png" alt="Logo" className="logo" />
                </a>
                <input type="text" className="search2" placeholder="Search for shows/shortfilms" />
                <ul className={`navlist2 ${menuActive ? "active" : ""}`}>
                    <li className="list"><a href="/">HOME</a></li>
                    <li className="list"><a href="/short">ABOUT</a></li>
                    <li className="list"><a href="/contact">CONTACT</a></li>
                    <li className="list"><a href="/movies">BOOK TICKETS</a></li>
                    <div className={`hamburger2 ${menuActive ? "active" : ""}`} onClick={toggleMenu}>
                        <span className="bar2"></span>
                        <span className="bar2"></span>
                        <span className="bar2"></span>
                    </div>
                </ul>
            </header>

            <div>
                <h5>Select your Show</h5>
            </div>

            <div
                className="slider"
                style={{
                    transform: `translateX(-${currentMovieIndex * (isMobile ? 33 : 25)}%)`,
                }}
            >
                {["Am Show", "Mid Show", "Pm Show"].map((show, index) => (
                    <div key={show} className={`item ${currentMovieIndex === index ? "show" : ""}`}>
                        <h1 className="shows">{show} <br /> </h1>
                        <h4 className="times">{index === 0 ? "10 am - 11:30 am" : index === 1 ? "12 pm - 1:30 pm" : "2 pm - 3:30 pm"}</h4>
                        {/* ✅ Assigned unique class names to each image */}
                        <img
                            src={
                                index === 0 ? "amshow.png" :
                                index === 1 ? "noonshow.jpeg" :
                                "pmshow.jpeg"
                            }
                            alt={show}
                            className={`movie-image ${index === 0 ? "am-show-image" : index === 1 ? "mid-show-image" : "pm-show-image"}`}
                        />
                        <button
                            className={`movie-btn ${movieStatus[show] ? "disabled" : ""}`}
                            onClick={() => handleBuyNowClick(show)}
                            disabled={movieStatus[show]}
                        >
                            <h6>BOOK NOW</h6>
                        </button>
                    </div>
                ))}
            </div>
            <button id="next" onClick={handleNext}>{"<"}</button>
            <button id="prev" onClick={handlePrev}>{">"}</button>

            <div className="right">
                <a href="mailto:arcadiarhythms@gmail.com">MAIL US</a>
                <a href="https://www.instagram.com/_shankar_peram">INSTAGRAM</a>
                <a href="https://wa.me/9491601009" target="_blank" rel="noopener noreferrer">WHATSAPP</a>
            </div>
        </div>
    );
};

export default MovieSelect;
