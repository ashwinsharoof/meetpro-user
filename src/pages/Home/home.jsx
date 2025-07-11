import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import '../Home/style/home.css';
import { useNavigate } from 'react-router-dom';

// Inside your component

const categories = [
  "Career", "Consulting", "Content", "Cybersecurity", "Data & AI", "Design",
  "Finance", "HR", "Law", "Marketing", "Mental Health", "Product", "Software",
  "Study Abroad", "Best Selling", "Supply Chain", "Others"
];

export default function HomePage() {
  const [experts, setExperts] = useState([]);
  const [filteredExperts, setFilteredExperts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [expertServices, setExpertServices] = useState([]);
    const navigate = useNavigate();


  useEffect(() => {
    fetchExperts();
  }, []);

  useEffect(() => {
    if (!selectedCategory) {
      setFilteredExperts(experts.slice(0, 5));
    } else if (selectedCategory === 'Others') {
      setFilteredExperts(experts.filter(expert =>
        !categories.includes(expert.category)
      ));
    } else {
      setFilteredExperts(experts.filter(expert =>
        expert.category === selectedCategory
      ));
    }
  }, [experts, selectedCategory]);

  const fetchExperts = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/v1/expert/');
      const data = await res.json();
      if (res.ok) {
        setExperts(data);
      } else {
        console.error('Failed to fetch experts');
      }
    } catch (err) {
      console.error('Error fetching experts:', err);
    }
  };

const handleExpertClick = (expert) => {
  navigate(`/expert/${expert._id}`, { state: { expert } });
};

  const closeModal = () => {
    setShowModal(false);
    setSelectedExpert(null);
    setExpertServices([]);
  };

  return (
    <div>
      <Navbar />
      <h1>The Platform for Experts</h1>
      <br />
      <center>Experts from every niche use Topmate to build trust, grow revenue, and stay booked.</center>
      <br /><br />

      <div className="category-section">
        {categories.map((cat) => (
          <button
            key={cat}
            className={selectedCategory === cat ? 'active-category' : 'category-button'}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
<br></br>
      <h2 className="section-title">
        {selectedCategory ? `Experts in ${selectedCategory}` : 'Featured Experts'}
      </h2>

      <div className="expert-grid">
        {filteredExperts.map((expert) => (
          <div key={expert._id} className="expert-card" onClick={() => handleExpertClick(expert)}>
            <img
              src={
                expert.profileImage ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(expert.username)}&background=0D8ABC&color=fff`
              }
              alt={expert.username}
              className="expert-photo"
            />
            <h3>{expert.username}</h3>
            <p>{expert.category}</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && selectedExpert && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3>{selectedExpert.username}'s Services</h3>
            <ul>
              {expertServices.length > 0 ? (
                expertServices.map((service, index) => (
                  <li key={index}>
                    <strong>{service.Title}</strong>: ₹{service.Amount} <br />
                    <em>{service.Description}</em>
                  </li>
                ))
              ) : (
                <p>No services available.</p>
              )}
            </ul>

            <div className="modal-actions">
              <button onClick={closeModal} className="cancel-btn">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
