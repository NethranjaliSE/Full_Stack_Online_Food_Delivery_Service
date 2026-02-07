import React, { useContext, useState, useEffect } from "react";
import "./PlaceOrder.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { calculateCartTotals } from "../../util/cartUtils";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../../service/orderService";
import { clearCartItems } from "../../service/cartService";

const PlaceOrder = () => {
  const { foodList, quantities, setQuantities, token, fetchFoodList } =
    useContext(StoreContext);

  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
  });

  const cartItems = foodList.filter((food) => quantities[food.id] > 0);
  const { subtotal, delivery, tax, total } = calculateCartTotals(
    cartItems,
    quantities,
  );

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else if (cartItems.length === 0) {
      navigate("/cart");
    }
  }, [token, cartItems.length, navigate]);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    // 1. Create the order object for your backend
    const orderData = {
      userAddress: `${data.address}, ${data.city}`,
      phoneNumber: data.phoneNumber,
      email: data.email,
      orderedItems: cartItems.map((item) => ({
        id: item.id,
        quantity: quantities[item.id],
        price: item.price * quantities[item.id],
        name: item.name,
      })),
      amount: total.toFixed(2), // Important: 2 decimal places
      orderStatus: "Preparing",
    };

    try {
      // 2. Send to backend to save order and get Hash
      const response = await createOrder(orderData, token);

      // 3. If backend gives us a hash, open PayHere
      if (response && response.hash) {
        initiatePayHerePayment(response);
      } else {
        toast.error("Failed to initialize payment. Try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error connecting to server.");
    }
  };

  const initiatePayHerePayment = (backendData) => {
    if (!window.payhere) {
      toast.error("PayHere SDK is not loaded.");
      return;
    }

    // --- KEY FIX: Manually build the Payment Object ---
    // Since we aren't using Ngrok, we rely on 'return_url' and 'onCompleted'
    const payment = {
      sandbox: true,
      merchant_id: backendData.merchant_id, // Must match your PayHere ID

      // Redirects for success/cancel (Localhost is fine here)
      return_url: "http://localhost:5173/myorders",
      cancel_url: "http://localhost:5173/cart",

      // Keep this empty or a dummy URL since you aren't using Ngrok
      notify_url: "http://localhost:8081/api/orders/notify",

      order_id: backendData.order_id,
      items: "Food Order",
      amount: total.toFixed(2), // Must match the hash generation amount
      currency: "LKR",
      hash: backendData.hash, // The security hash from your backend

      // User details from your Form State
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phoneNumber,
      address: data.address,
      city: data.city,
      country: "Sri Lanka",
    };

    // --- Success Handler ---
    window.payhere.onCompleted = async function onCompleted(orderId) {
      console.log("Payment completed. OrderID:" + orderId);
      toast.success("Payment Successful!");

      // Since notify_url won't work on localhost, we clear the cart here manually
      await clearCart();

      if (fetchFoodList) {
        await fetchFoodList();
      }
      navigate("/myorders");
    };

    // --- Dismissed Handler ---
    window.payhere.onDismissed = function onDismissed() {
      toast.info("Payment dismissed.");
    };

    // --- Error Handler ---
    window.payhere.onError = function onError(error) {
      console.log("Error:" + error);
      toast.error("Payment Failed: " + error);
    };

    // Open the popup
    window.payhere.startPayment(payment);
  };

  const clearCart = async () => {
    try {
      await clearCartItems(token, setQuantities);
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  return (
    <div className="container mt-4">
      <main>
        {/* ... (Keep your existing HTML/JSX for the form exactly as it was) ... */}
        <div className="py-5 text-center">
          <img
            className="d-block mx-auto"
            src={assets.logo}
            alt=""
            width="98"
            height="98"
          />
        </div>
        <div className="row g-5">
          {/* Cart Summary */}
          <div className="col-md-5 col-lg-4 order-md-last">
            <h4 className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-primary">Your cart</span>
              <span className="badge bg-primary rounded-pill">
                {cartItems.length}
              </span>
            </h4>
            <ul className="list-group mb-3">
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  className="list-group-item d-flex justify-content-between lh-sm"
                >
                  <div>
                    <h6 className="my-0">{item.name}</h6>
                    <small className="text-body-secondary">
                      Qty: {quantities[item.id]}
                    </small>
                  </div>
                  <span className="text-body-secondary">
                    Rs.{(item.price * quantities[item.id]).toFixed(2)}
                  </span>
                </li>
              ))}
              <li className="list-group-item d-flex justify-content-between">
                <span>Total (Rs.)</span>
                <strong>Rs.{total.toFixed(2)}</strong>
              </li>
            </ul>
          </div>

          {/* Billing Form */}
          <div className="col-md-7 col-lg-8">
            <h4 className="mb-3">Billing address</h4>
            <form className="needs-validation" onSubmit={onSubmitHandler}>
              <div className="row g-3">
                <div className="col-sm-6">
                  <label className="form-label">First name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="firstName"
                    value={data.firstName}
                    onChange={onChangeHandler}
                    required
                  />
                </div>
                <div className="col-sm-6">
                  <label className="form-label">Last name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="lastName"
                    value={data.lastName}
                    onChange={onChangeHandler}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={data.email}
                    onChange={onChangeHandler}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Phone</label>
                  <input
                    type="number"
                    className="form-control"
                    name="phoneNumber"
                    value={data.phoneNumber}
                    onChange={onChangeHandler}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    value={data.address}
                    onChange={onChangeHandler}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">City</label>
                  <select
                    className="form-select"
                    name="city"
                    value={data.city}
                    onChange={onChangeHandler}
                    required
                  >
                    <option value="">Choose...</option>
                    <option value="Colombo">Colombo</option>
                    <option value="Kandy">Kandy</option>
                    <option value="Galle">Galle</option>
                  </select>
                </div>
              </div>
              <hr className="my-4" />
              <button
                className="w-100 btn btn-primary btn-lg"
                type="submit"
                disabled={cartItems.length === 0}
              >
                Pay with PayHere
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlaceOrder;
