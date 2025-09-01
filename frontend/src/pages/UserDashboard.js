import React, { useEffect, useState } from "react";
import API from "../api";
import "../styles/UserDashboard.css";

function UserDashboard() {
  const [stores, setStores] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState({});

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await API.get("/user/stores", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setStores(res.data);
      } catch (err) {
        console.error("Error fetching stores", err);
      }
    };
    fetchStores();
  }, []);

  const handleStarClick = (storeId, rating) => {
    setSelectedRatings({ ...selectedRatings, [storeId]: rating });
  };

  const handleSubmitRating = async (storeId) => {
    try {
      await API.post(
        "/user/rating",
        { storeId, rating: selectedRatings[storeId] },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("Rating submitted successfully!");
    } catch (err) {
      alert("Error submitting rating");
    }
  };

  return (
    <div className="user-dashboard">
      <h2>Available Stores</h2>
      <div className="store-list">
        {stores.length > 0 ? (
          stores.map((store) => (
            <div key={store.id} className="store-card">
              {/* Placeholder for store photo */}
              <img
                src="https://via.placeholder.com/300x200"
                alt={store.name}
                className="store-img"
              />
              <h3>{store.name}</h3>
              <p>{store.address}</p>
              
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${selectedRatings[store.id] >= star ? "selected" : ""}`}
                    onClick={() => handleStarClick(store.id, star)}
                  >
                    ★
                  </span>
                ))}
              </div>
              <button
                disabled={!selectedRatings[store.id]}
                onClick={() => handleSubmitRating(store.id)}
              >
                Submit Rating
              </button>
            </div>
          ))
        ) : (
          <p>No stores available</p>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
