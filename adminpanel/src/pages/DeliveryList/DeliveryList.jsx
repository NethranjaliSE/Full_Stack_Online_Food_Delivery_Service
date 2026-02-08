import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
//import "./DeliveryList.css";

const DeliveryList = ({ url }) => {
  const [list, setList] = useState([]);
  const token = localStorage.getItem("token");

  const fetchDrivers = async () => {
    try {
      const response = await axios.get(
        `${url}/api/delivery/all-delivery-personnel`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.length === 0) {
        toast.info("No delivery drivers found.");
      }
      setList(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch driver list.");
    }
  };

  useEffect(() => {
    if (token) {
      fetchDrivers();
    }
  }, [token]);

  return (
    <div className="container py-5">
      <h3 className="mb-4">Registered Delivery Team</h3>
      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Current Status</th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-muted">
                    No drivers registered yet.
                  </td>
                </tr>
              ) : (
                list.map((driver) => (
                  <tr key={driver.id}>
                    <td className="fw-bold">{driver.name}</td>
                    <td>{driver.email}</td>
                    <td>
                      {driver.available ? (
                        <span className="badge bg-success">Online 🟢</span>
                      ) : (
                        <span className="badge bg-danger">Busy 🔴</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeliveryList;
