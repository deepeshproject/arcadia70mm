
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';

const Home = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [menuActive, setMenuActive] = useState(false); // ✅ State for hamburger toggle

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            const trimmedQuery = searchQuery.trim().toLowerCase();
            if (trimmedQuery === 'shows' || trimmedQuery === 'book' || trimmedQuery === 'tickets') {
                navigate('/movies');
            }
        }
    };

    const toggleMenu = () => {
        setMenuActive(!menuActive); // ✅ Toggle the menu state
    };

    return (
        <div>
            <header>
                <a href="/" className="logo">
                    <img src="./logofinal.png" alt="Logo" className="logo" />
                </a>

                {/* ✅ Hamburger Icon */}

                {/* 🔍 Search Bar */}
                <input 
                    type="text" 
                    className="search" 
                    placeholder="Search for shows/shortfilms" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                {/* ✅ Navigation List */}
                <ul className={`navlist ${menuActive ? 'active' : ''}`}>
                    <li className="list"><a href="/">HOME</a></li>
                    <li className="list"><a href="/short">ABOUT</a></li>
                    <li className="list"><a href="/contact">CONTACT</a></li>
                    <li className="list"><a href="/movies">BOOK TICKETS</a></li>
                    <div 
                    className={`hamburger ${menuActive ? 'active' : ''}`} 
                    onClick={toggleMenu}
                >
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </div>
                </ul>
            </header>

            <section className="home">
                <div className="container">
                    <div className="card__container">
                        <article className="card__article2">
                            <img src="./booknow.jpeg" alt="" className="card__img2" />
                            <div className="card__data2">
                                <h2 className="card__title2">Book Tickets Right now</h2>
                                <span className="card__description2">🎬 Lights. Camera. Action! Experience Movies Like Never Before on the Grand 70mm Screen!</span>
                                <a href="/movies" className="card__button2"><br />BOOK BHAYYA</a>
                            </div>
                        </article>
                        <article className="card__article">
                            <img src="./shortfilms-list.jpeg" alt="" className="card__img2" />
                            <div className="card__data">
                                <h2 className="card__title">Short Films</h2>
                                <span className="card__description">Uncover the Purest Form of Talent – Click Here to Dive into an Inspiring Collection of Short Films! 🎬✨</span>
                                <a href="/short" className="card__button"><br />SHOW MORE</a>
                            </div>
                        </article>
                    </div>
                </div>
            </section>

            <div className="right">
                <a href="mailto:arcadiarhythms@gmail.com">MAIL US</a>
                <a href="https://www.instagram.com/arcadia_rhythms?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==">INSTAGRAM</a>
                <a href="https://wa.me/9491601009" target="hi">WHATSAPP</a>
            </div>
        </div>
    );
};

export default Home;
