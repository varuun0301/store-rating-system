import React, { useEffect, useState } from "react";
import API from "../api";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [message, setMessage] = useState("");

  // Form states
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "USER", address: "" });
  const [newStore, setNewStore] = useState({ name: "", email: "", address: "", ownerId: "" });

  // Fetch Dashboard Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await API.get("/admin/dashboard");
        setStats(statsRes.data);

        const usersRes = await API.get("/admin/users");
        setUsers(usersRes.data);

        const storesRes = await API.get("/admin/stores");
        setStores(storesRes.data);
      } catch (err) {
        setMessage("Error fetching data");
      }
    };
    fetchData();
  }, []);

  // Add User
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/admin/add-user", newUser);
      setUsers([...users, res.data.user]);
      setNewUser({ name: "", email: "", password: "", role: "USER", address: "" });
      alert("User added successfully!");
    } catch (err) {
      alert("Error adding user");
    }
  };

  // Add Store
  const handleAddStore = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/admin/add-store", newStore);
      setStores([...stores, res.data.store]);
      setNewStore({ name: "", email: "", address: "", ownerId: "" });
      alert("Store added successfully!");
    } catch (err) {
      alert("Error adding store");
    }
  };

  // Delete User
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await API.delete(`/admin/delete-user/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      alert("Error deleting user");
    }
  };

  // Delete Store
  const handleDeleteStore = async (id) => {
    if (!window.confirm("Are you sure you want to delete this store?")) return;
    try {
      await API.delete(`/admin/delete-store/${id}`);
      setStores(stores.filter((store) => store.id !== id));
    } catch (err) {
      alert("Error deleting store");
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      {message && <p>{message}</p>}

      {/* Dashboard Stats */}
      <div className="stats-cards">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Total Stores</h3>
          <p>{stats.totalStores}</p>
        </div>
        <div className="stat-card">
          <h3>Total Ratings</h3>
          <p>{stats.totalRatings}</p>
        </div>
      </div>
      {/* Add User Form */}
      <div className="form-card">
        <h3>Add User/Owner/Admin</h3>
        <form onSubmit={handleAddUser}>
          <input type="text" placeholder="Name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} required />
          <input type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} required />
          <input type="password" placeholder="Password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required />
          <input type="text" placeholder="Address" value={newUser.address} onChange={(e) => setNewUser({ ...newUser, address: e.target.value })} required />
          <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} required>
            <option value="">Select Role</option>
            <option value="USER">USER</option>
            <option value="OWNER">OWNER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          <button type="submit">Add User</button>
        </form>
      </div>

      {/* Add Store Form */}
      <div className="form-card">
        <h3>Add Store</h3>
        <form onSubmit={handleAddStore}>
          <input
            type="text"
            placeholder="Store Name"
            value={newStore.name}
            onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={newStore.email}
            onChange={(e) => setNewStore({ ...newStore, email: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Address"
            value={newStore.address}
            onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
            required
          />

          {/* Dropdown for Owner selection */}
          <select
            value={newStore.ownerId}
            onChange={(e) => setNewStore({ ...newStore, ownerId: e.target.value })}
            required
          >
            <option value="">Select Owner</option>
            {users
              .filter(user => user.role === "OWNER")
              .map(owner => (
                <option key={owner.id} value={owner.id}>
                  {owner.id} - {owner.name} ({owner.email})
                </option>
              ))}
          </select>

          <button type="submit">Add Store</button>
        </form>
      </div>



      {/* Users List */}
      <div className="table-container">
        <h3>All Users</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Address</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.address}</td>
                <td><button onClick={() => handleDeleteUser(user.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stores List */}
      <div className="table-container">
        <h3>All Stores</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Email</th><th>Address</th><th>Avg Rating</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => (
              <tr key={store.id}>
                <td>{store.id}</td>
                <td>{store.name}</td>
                <td>{store.email}</td>
                <td>{store.address}</td>
                <td>{Number(store.avgRating || 0).toFixed(1)}</td>
                <td><button onClick={() => handleDeleteStore(store.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    {/* Owners List */}
    <div className="table-section">
      <h3>All Owners</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {users.filter(user => user.role === "OWNER").length > 0 ? (
            users
              .filter(user => user.role === "OWNER")
              .map(owner => (
                <tr key={owner.id}>
                  <td>{owner.id}</td>
                  <td>{owner.name}</td>
                  <td>{owner.email}</td>
                  <td>{owner.address}</td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>No owners found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </div>
  );
}


export default AdminDashboard;
