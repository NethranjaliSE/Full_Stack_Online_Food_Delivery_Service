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
  // 1. Destructure 'fetchFoodList' from Context
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
    const orderData = {
      userAddress: `${data.firstName} ${data.lastName}, ${data.address}, ${data.city}`,
      phoneNumber: data.phoneNumber,
      email: data.email,
      orderedItems: cartItems.map((item) => ({
        id: item.id,
        quantity: quantities[item.id],
        price: item.price * quantities[item.id],
        category: item.category,
        imageUrl: item.imageUrl,
        description: item.description,
        name: item.name,
      })),
      amount: total.toFixed(2),
      orderStatus: "Preparing",
    };

    try {
      const payHereParams = await createOrder(orderData, token);
      if (payHereParams && payHereParams.hash) {
        initiatePayHerePayment(payHereParams);
      } else {
        toast.error("Unable to initiate payment. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error connecting to server.");
    }
  };

  const initiatePayHerePayment = (paymentData) => {
    if (!window.payhere) {
      toast.error("PayHere SDK not loaded. Check your internet connection.");
      return;
    }

    // --- SUCCESS HANDLER ---
    window.payhere.onCompleted = async function onCompleted(orderId) {
      console.log("Payment completed. OrderID:" + orderId);
      toast.success("Payment Successful!");

      await clearCart(); // Clear cart first

      // 2. SMOOTH UPDATE: Update stock without page reload
      if (fetchFoodList) {
        await fetchFoodList();
      }

      // 3. Navigate smoothly
      navigate("/myorders");
    };

    window.payhere.onDismissed = function onDismissed() {
      console.log("Payment dismissed");
      toast.info("Payment was cancelled.");
    };

    window.payhere.onError = function onError(error) {
      console.log("Error:" + error);
      toast.error("Payment Failed: " + error);
    };

    window.payhere.startPayment(paymentData);
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
                <div>
                  <span>Delivery</span>
                </div>
                <span className="text-body-secondary">
                  Rs.{subtotal === 0 ? "0.00" : delivery.toFixed(2)}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <div>
                  <span>Tax (10%)</span>
                </div>
                <span className="text-body-secondary">Rs.{tax.toFixed(2)}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Total (Rs.)</span>
                <strong>Rs.{total.toFixed(2)}</strong>
              </li>
            </ul>
          </div>

          <div className="col-md-7 col-lg-8">
            <h4 className="mb-3">Billing address</h4>
            <form className="needs-validation" onSubmit={onSubmitHandler}>
              <div className="row g-3">
                <div className="col-sm-6">
                  <label htmlFor="firstName" className="form-label">
                    First name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    name="firstName"
                    value={data.firstName}
                    onChange={onChangeHandler}
                    required
                  />
                </div>
                <div className="col-sm-6">
                  <label htmlFor="lastName" className="form-label">
                    Last name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    name="lastName"
                    value={data.lastName}
                    onChange={onChangeHandler}
                    required
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={data.email}
                    onChange={onChangeHandler}
                    required
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="phone" className="form-label">
                    Phone Number
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="phone"
                    name="phoneNumber"
                    value={data.phoneNumber}
                    onChange={onChangeHandler}
                    required
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="address" className="form-label">
                    Address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    name="address"
                    value={data.address}
                    onChange={onChangeHandler}
                    required
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="city" className="form-label">
                    City
                  </label>
                  <select
                    className="form-select"
                    id="city"
                    name="city"
                    value={data.city}
                    onChange={onChangeHandler}
                    required
                  >
                    <option value="">Choose...</option>
                    <option value="Colombo">Colombo</option>
                    <option value="Kelaniya">Kelaniya</option>
                    <option value="Kiribathgoda">Kiribathgoda</option>
                    <option value="Kadawatha">Kadawatha</option>
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
