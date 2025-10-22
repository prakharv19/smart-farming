// frontend/src/pages/PublicEquipment.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PublicEquipment.css";

const PublicEquipment = () => {
  const [equipment, setEquipment] = useState([]);

  const fetchEquipment = async () => {
    try {
      const res = await axios.get("https://smart-farming-backend-2cxi.onrender.com/api/public/equipment");
      setEquipment(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch available equipment");
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  return (
    <div className="public-equipment">
      <h2>⚙️ Available Equipment for Rent</h2>
      {equipment.length === 0 ? (
        <p>No equipment available right now.</p>
      ) : (
        equipment.map((eq) => (
          <div key={eq._id} className="equip-card">
            {eq.image && <img src={eq.image} alt={eq.name} className="equip-img" />}
            <div>
              <h3>{eq.name}</h3>
              <p><strong>Type:</strong> {eq.type}</p>
              <p><strong>Location:</strong> {eq.location}</p>
              <p><strong>Rent:</strong> ₹{eq.rentPrice}/day</p>
              <p><strong>Owner:</strong> {eq.owner?.fullName} ({eq.owner?.phone})</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PublicEquipment;
