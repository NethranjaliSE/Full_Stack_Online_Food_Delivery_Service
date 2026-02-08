import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Contact.css"; // Add basic CSS for styling

const Contact = () => {
  const url = "http://localhost:8081";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${url}/api/contact/add`, formData);
      if (response.status === 200) {
        toast.success("Message sent successfully!");
        setFormData({ name: "", email: "", subject: "", message: "" });
      }
    } catch (error) {
      toast.error("Error sending message.");
    }
  };

  return (
    <div className="contact-container container py-5">
      <h2 className="text-center mb-4">Contact Us</h2>
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <form onSubmit={onSubmitHandler} className="card p-4 shadow-sm">
            <div className="mb-3">
              <label className="form-label">Your Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={onChangeHandler}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Your Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onChangeHandler}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={onChangeHandler}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={onChangeHandler}
                className="form-control"
                rows="5"
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
