import React, { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./Cart.css";
import { Link, useNavigate } from "react-router-dom";
import { calculateCartTotals } from "../../util/cartUtils";

const Cart = () => {
  const navigate = useNavigate();
  const { foodList, increaseQty, decreaseQty, quantities, removeFromCart } =
    useContext(StoreContext);

  //cart items
  const cartItems = foodList.filter((food) => quantities[food.id] > 0);

  //calcualtiong
  const { subtotal, delivery, tax, total } = calculateCartTotals(
    cartItems,
    quantities,
  );

  return (
    <div className="container py-5">
      <h1 className="mb-5">Your Shopping Cart</h1>
      <div className="row">
        <div className="col-lg-8">
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div className="card mb-4">
              <div className="card-body">
                {cartItems.map((food) => {
                  // --- NEW LOGIC START ---
                  const currentQty = quantities[food.id];
                  // Check if stock is defined and if we hit the limit
                  const isMaxReached =
                    food.stock !== null &&
                    food.stock !== undefined &&
                    currentQty >= food.stock;
                  // --- NEW LOGIC END ---

                  return (
                    <div
                      key={food.id}
                      className="row cart-item mb-3 align-items-center"
                    >
                      <div className="col-md-3">
                        <img
                          src={food.imageUrl}
                          alt={food.name}
                          className="img-fluid rounded"
                          width={100}
                        />
                      </div>
                      <div className="col-md-5">
                        <h5 className="card-title">{food.name}</h5>
                        <p className="text-muted">Category: {food.category}</p>
                      </div>

                      {/* Quantity Controls Column */}
                      <div className="col-md-2">
                        <div className="input-group">
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            type="button"
                            onClick={() => decreaseQty(food.id)}
                          >
                            -
                          </button>
                          <input
                            style={{ maxWidth: "50px", textAlign: "center" }}
                            type="text"
                            className="form-control form-control-sm"
                            value={currentQty}
                            readOnly
                          />
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            type="button"
                            // Prevent click if max reached
                            onClick={() => {
                              if (!isMaxReached) increaseQty(food.id);
                            }}
                            // Bootstrap visual disable
                            disabled={isMaxReached}
                          >
                            +
                          </button>
                        </div>

                        {/* Warning Text */}
                        {isMaxReached && (
                          <small
                            className="text-danger d-block mt-1"
                            style={{ fontSize: "0.75rem" }}
                          >
                            Max limit reached
                          </small>
                        )}
                      </div>

                      <div className="col-md-2 text-end">
                        <p className="fw-bold">
                          Rs.{(food.price * currentQty).toFixed(2)}
                        </p>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => removeFromCart(food.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                      <hr className="mt-3" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="text-start mb-4">
            <Link to="/" className="btn btn-outline-primary">
              <i className="bi bi-arrow-left me-2"></i>Continue Shopping
            </Link>
          </div>
        </div>

        {/* Summary Section (Unchanged) */}
        <div className="col-lg-4">
          <div className="card cart-summary">
            <div className="card-body">
              <h5 className="card-title mb-4">Order Summary</h5>
              <div className="d-flex justify-content-between mb-3">
                <span>Subtotal</span>
                <span>Rs.{subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Delivery</span>
                <span>Rs.{subtotal === 0 ? 0.0 : delivery.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Tax</span>
                <span>Rs.{tax.toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <strong>Total</strong>
                <strong>Rs.{subtotal === 0 ? 0.0 : total.toFixed(2)}</strong>
              </div>
              <button
                className="btn btn-primary w-100"
                disabled={cartItems.length === 0}
                onClick={() => navigate("/order")}
              >
                Proceed to Pay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
