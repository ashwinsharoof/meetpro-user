import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import '../ExpertServices/style/expertServices.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function ExpertServices() {
  const { expertId } = useParams();
  const location = useLocation();
  const expert = location.state?.expert;
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [startDateTime, setStartDateTime] = useState(null);
  const calendarStart = new Date(expert?.calendar?.start);
  const calendarEnd = new Date(expert?.calendar?.end);
  const availability = expert?.availability || {};

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/v1/service/expert/${expertId}`);
      const data = await res.json();
      if (res.ok) {
        setServices(data);
      } else {
        console.error('Failed to fetch services');
      }
    } catch (err) {
      console.error('Error fetching services:', err);
    }
  };

  const isDayAvailable = (date) => {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    return availability[dayName] && availability[dayName].length > 0;
  };

  const isTimeInRange = (date) => {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const timeSlots = availability[dayName];
    if (!timeSlots) return false;

    const hours = date.getHours();
    const minutes = date.getMinutes();

    return timeSlots.some(slot => {
      const [startH, startM] = slot.start.split(':').map(Number);
      const [endH, endM] = slot.end.split(':').map(Number);

      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;
      const currentMinutes = hours * 60 + minutes;

      return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
    });
  };

const handleBooking = async () => {
  if (!startDateTime) {
    alert("Please select a start time.");
    return;
  }

  const bookingDate = startDateTime.toISOString().split("T")[0]; // yyyy-mm-dd
  const bookingTime = startDateTime.toTimeString().split(" ")[0].slice(0, 5); // hh:mm
  const UserId = localStorage.getItem('userId');


  try {
    const res = await fetch('http://localhost:8080/api/v1/booking/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        expertId,
        userId: UserId, // ⬅️ Replace with actual userId
        service: selectedService.Title, // or _id if needed
        bookingDate,
        bookingTime,
      }),
    });

    if (res.ok) {
      alert('Booking successful!');
      setShowModal(false);
      setStartDateTime(null);
    } else {
      const err = await res.json();
      alert('Booking failed: ' + (err.message || 'Unknown error'));
    }
  } catch (err) {
    console.error('Booking error:', err);
    alert('Booking failed. Please try again.');
  }
};



  return (
    <div>
      <Navbar />
      <div className="expert-header">
        <img
          src={
            expert?.profileImage ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(expert?.username)}&background=0D8ABC&color=fff`
          }
          alt={expert?.username}
          className="expert-photo-large"
        />
        <div>
          <h2>{expert?.username}</h2>
          <p>{expert?.category}</p>
        </div>
      </div>

      <h3 className="section-title">Services Offered</h3>
      <div className="service-list">
        {services.length > 0 ? (
          services.map((service) => (
            <div className="service-card" key={service._id}>
              <img
                src={
                  service.UploadCoverPhoto
                    ? service.UploadCoverPhoto
                    : "https://images.unsplash.com/photo-1603574670812-d24560880210?auto=format&fit=crop&w=800&q=80"
                }
                alt="Service Cover"
                className="service-cover"
              />
              <h4 className="service-title">{service.Title}</h4>
              <p className="service-desc">{service.Description}</p>
              <span className="service-amount">₹ {service.Amount}</span><br />
              <br />
              <button
                className="book-button"
                onClick={() => {
                  setSelectedService(service);
                  setShowModal(true);
                }}
              >
                Book Now
              </button>
            </div>
          ))
        ) : (
          <p>No services available.</p>
        )}
      </div>

{showModal && (
  <div className="modal-overlay">
    <div className="booking-modal">
      <h2 className="modal-title">Book "{selectedService?.Title}"</h2>
      <p className="modal-subtitle">
        Select a suitable time within the expert’s availability
      </p>

      <div className="picker-group">
        <label className="picker-label">Start Time:</label>
        <DatePicker
          selected={startDateTime}
          onChange={(date) => setStartDateTime(date)}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="MMMM d, yyyy h:mm aa"
          placeholderText="Select start time"
          filterDate={(date) =>
            date >= calendarStart &&
            date <= calendarEnd &&
            isDayAvailable(date)
          }
          filterTime={(time) => isTimeInRange(time)}
          className="picker-input"
          minDate={calendarStart}
          maxDate={calendarEnd}
        />
      </div>

      <div className="modal-buttons">
        <button onClick={handleBooking} className="btn btn-confirm">Confirm</button>
        <button onClick={() => setShowModal(false)} className="btn btn-cancel">Cancel</button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
