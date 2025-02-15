import React, { useState } from "react";
import axios from "axios";
import './ContactForm.css';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rollNumber: "",
    issue: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendEmail = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/send-email", formData);
      alert(response.data.message);
      setFormData({ name: "", email: "", rollNumber: "", issue: "" });
    } catch (error) {
      alert("Failed to send email. Try again later.");
    }
  };

  return (
    <div className="contact-container">
      <h2>Contact Form</h2>
      <h6>write down your query</h6>
      <br />
      <form onSubmit={sendEmail} className="contact-form">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="rollNumber"
          placeholder="Roll Number"
          value={formData.rollNumber}
          onChange={handleChange}
          required
        />
        <textarea
          name="issue"
          className="issue"
          placeholder="Describe your issue"
          value={formData.issue}
          onChange={handleChange}
          required
        />
        <button type="submit">Send</button>
      </form>
      <a href="/" className="gogo">Go to Home</a>
    </div>
  );
};

export default ContactForm;
