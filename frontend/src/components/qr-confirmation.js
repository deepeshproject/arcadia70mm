import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './qr.css';

const QRConfirmation = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);

    const seatNumbers = params.get('seats');
    const name = params.get('name');
    const phone = params.get('phone');
    const selectedMovie = params.get('show');

    const qrData = JSON.stringify({ name, phone, seats: seatNumbers, show: selectedMovie });

    const pageRef = useRef(null);

    const downloadAsPDF = async () => {
        const element = pageRef.current; // Reference to the whole page content
        console.log(seatNumbers);
        // Temporarily hide the button to exclude it from the PDF
        const buttons = element.querySelectorAll('button');
        buttons.forEach(button => button.style.display = 'none');
        
        // Generate the canvas
        // Hide the button during rendering
    // buttons.forEach(button => (button.style.display = 'none'));

// Generate the canvas
    const canvas = await html2canvas(element, { scale: 4, useCORS: true });
    // console.log('hiii' + canvas);
// Restore the button display
buttons.forEach(button => (button.style.display = 'block'));

        const imgData = canvas.toDataURL('image/png');
    
        // Restore the buttons
        buttons.forEach(button => button.style.display = 'block');
    
        const pdf = new jsPDF('p', 'mm', 'a4');
        // const pdfWidth = pdf.internal.pageSize.getWidth();
        // const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
        // Add the canvas image to the PDF
        pdf.addImage(imgData, 'PNG',50,20,100 , 100);
        
        pdf.save('booking-confirmation.pdf');
    };
    

    return (
        <div className="qr-container">
            <h2>Your Ticket</h2>
            <div className="qr-card" ref={pageRef}>
                
                {/* QR Code Section */}
                <div className="qr-code">
                    <QRCodeSVG value={qrData} size={150} />
                </div>

                {/* Separator Line */}
                { <div className="separator"></div> }
                
                {/* Booking Information */}
                {<div className="qr-info">
                    <p>{name}</p>
                    <p>{phone}</p>
                    <p>{seatNumbers}</p>
                    <p>{selectedMovie}</p>
                </div>}

                {/* PDF Download Button */}
                <button onClick={downloadAsPDF} className="pdf-download-button">
                    Download as PDF
                </button>
            </div>
        </div>
    );
};

export default QRConfirmation;
