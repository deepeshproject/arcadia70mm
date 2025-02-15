import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Movies from './components/Movies';
import Seats from './components/Seats';
import Payment from './components/Payment';
import QRConfirmation from './components/qr-confirmation';
import ContactForm from './components/ContactForm';
import Shortfilms from './components/shortfilms';

function App() {
    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/movies" element={<Movies />} />
                    <Route path="/seats" element={<Seats />} />
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/qr-confirmation" element={<QRConfirmation />} />
                    <Route path="/contact" element={<ContactForm />} />
                    <Route path="/short" element={<Shortfilms />} />

                    
                </Routes>
            </Router>
        </div>
    );
}

export default App;
