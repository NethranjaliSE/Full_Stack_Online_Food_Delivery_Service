# 🍔 Foodie Fleet - Full-Stack Food Delivery Platform

A comprehensive, full-stack food delivery application featuring distinct portals for Customers, Administrators, and Delivery Partners. Built with a robust Spring Boot backend and dynamic React frontends, this platform ensures seamless order placement, secure payments via PayHere, cloud image storage via AWS S3, and strict role-based access control.

## ✨ Features by Role

### 1. 👤 Customer (`ROLE_USER`)
* **Authentication:** Secure Email/Password login and seamless **Google OAuth2** login support.
* **Menu Exploration:** Browse the complete food catalog and view detailed item descriptions.
* **Cart Management:** Add, remove, and manage items in the shopping cart.
* **Secure Checkout:** Place orders with secure payment processing powered by **PayHere**.
* **Order Tracking:** Track real-time order status and view complete order history.

### 2. 👨‍💼 Administrator (`ROLE_ADMIN`)
* **Catalog Management:** Add, edit, and delete food items dynamically.
* **Cloud Storage:** Automatically upload and serve food images via **AWS S3 Buckets** for high performance.
* **Inventory Control:** Manage stock and inventory levels.
* **Order Dashboard:** View and manage all customer orders across the platform.
* **Dispatch & Logistics:** Update order statuses and manually assign available Delivery Partners to specific orders.

### 3. 🛵 Delivery Partner (`ROLE_DELIVERY`)
* **Availability Tracking:** Toggle online/offline status to indicate readiness for new deliveries.
* **Task Dashboard:** View newly assigned delivery tasks with complete customer and routing details.
* **Real-time Updates:** Update delivery statuses on the go and mark orders as successfully delivered.

---

## 🛠️ Tech Stack & Integrations

**Backend:**
* Java 17+ / Spring Boot
* Spring Security (JWT Token Authentication & Google OAuth2)
* Spring Data MongoDB

**Frontend(s):**
* React.js (Vite)
* Axios (API calls) & Context API (State Management)
* React Toastify (Notifications)

**Cloud & Third-Party Integrations:**
* **Database:** MongoDB (NoSQL)
* **Cloud Storage:** AWS S3 (Food Image Hosting)
* **Payment Gateway:** PayHere Integration

---

## 🏗️ System Architecture & Ports

This project runs on three separate servers locally:
1. **Backend API:** `http://localhost:8081`
2. **Customer App (Frontend):** `http://localhost:5173`
3. **Admin & Delivery Panel (Frontend):** `http://localhost:5174`

---

## 🚀 Installation & Setup

### Prerequisites
* Java Development Kit (JDK) 17+
* Node.js & npm
* MongoDB (Local or Atlas)
* AWS Account (for S3 credentials)
* PayHere Merchant Account (for Sandbox/Live keys)
