import React, { useEffect, useState } from "react";
import API from "../api";
import "../styles/OwnerDashboard.css";

function OwnerDashboard() {
  const [ratings, setRatings] = useState([]);
  const [avgRating, setAvgRating] = useState(null);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const res = await API.get("/owner/ratings");
        setRatings(res.data.ratings || []);
      } catch (err) {
        console.error("Error fetching ratings", err);
      }
    };

    const fetchAverage = async () => {
      try {
        const res = await API.get("/owner/average-rating");
        setAvgRating(res.data.averageRating ? Number(res.data.averageRating) : null);

      } catch (err) {
        console.error("Error fetching average rating", err);
      }
    };

    fetchRatings();
    fetchAverage();
  }, []);

  return (
    <div className="owner-dashboard">
      <h2>Owner Dashboard</h2>

      <div className="avg-rating-card">
        <h3>Average Rating</h3>
        <p>
          {avgRating !== null
            ? avgRating.toFixed(1) + " ⭐"
            : "No ratings yet"}
        </p>
      </div>


      <h3>Customer Ratings</h3>
      <table className="ratings-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {ratings.length > 0 ? (
            ratings.map((r) => (
              <tr key={r.id}>
                <td>{r.User.name}</td>
                <td>{r.User.email}</td>
                <td>{"⭐".repeat(r.rating)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                No ratings yet
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Add Store Form */}
<div className="add-store-card">
  <h3>Add New Store</h3>
  <form
    onSubmit={async (e) => {
      e.preventDefault();
      const name = e.target.storeName.value;
      const address = e.target.storeAddress.value;

      try {
        const res = await API.post("/owner/add-store", { name, address });
        alert("Store added successfully!");
        e.target.reset();
      } catch (err) {
        console.error("Error adding store", err);
        alert("Failed to add store");
      }
    }}
  >
    <input type="text" name="storeName" placeholder="Store Name" required />
    <input type="text" name="storeAddress" placeholder="Store Address" required />
    <button type="submit">Add Store</button>
  </form>
  </div>

    </div>
  );
}



export default OwnerDashboard;
