import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
//import "./Reviews.css"; // Optional styling

const Reviews = ({ url }) => {
  const [messages, setMessages] = useState([]);
  const token = localStorage.getItem("token");

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${url}/api/contact/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(response.data.reverse()); // Show newest first
    } catch (error) {
      toast.error("Error fetching messages");
    }
  };

  const deleteMessage = async (id) => {
    try {
      await axios.delete(`${url}/api/contact/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Message deleted");
      fetchMessages();
    } catch (error) {
      toast.error("Error deleting message");
    }
  };

  useEffect(() => {
    if (token) fetchMessages();
  }, [token]);

  return (
    <div className="container py-5">
      <h3>Customer Messages & Reviews</h3>
      <div className="row mt-4">
        {messages.length === 0 ? (
          <p className="text-center text-muted">No messages yet.</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="col-12 mb-3">
              <div className="card shadow-sm">
                <div className="card-header d-flex justify-content-between align-items-center bg-light">
                  <span className="fw-bold">{msg.subject}</span>
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="btn btn-sm btn-outline-danger"
                  >
                    🗑 Delete
                  </button>
                </div>
                <div className="card-body">
                  <h6 className="card-subtitle mb-2 text-muted">
                    From: {msg.name} ({msg.email})
                  </h6>
                  <p className="card-text mt-3">{msg.message}</p>
                  <small className="text-muted">
                    Received: {new Date(msg.date).toLocaleString()}
                  </small>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reviews;
