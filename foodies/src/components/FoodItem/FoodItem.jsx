import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const FoodItem = ({ name, description, id, imageUrl, price, stock }) => {
  // Ensure these match your Context names exactly
  const { increaseQty, decreaseQty, quantities } = useContext(StoreContext);

  const qty = quantities?.[id] || 0;

  // Logic: Check if stock exists and is 0
  const isOutOfStock = stock !== null && stock !== undefined && stock <= 0;

  // Logic: Check if we have hit the maximum limit
  const isMaxReached = stock !== null && stock !== undefined && qty >= stock;

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex justify-content-center">
      <div className="card" style={{ maxWidth: "320px" }}>
        <Link
          to={`/food/${id}`}
          style={{ position: "relative", display: "block" }}
        >
          <img
            src={imageUrl}
            className="card-img-top"
            alt="Product Image"
            height={300}
            width={60}
            style={{
              filter: isOutOfStock ? "grayscale(100%)" : "none",
              opacity: isOutOfStock ? "0.6" : "1",
            }}
          />

          {isOutOfStock && (
            <span className="position-absolute top-50 start-50 translate-middle badge rounded-pill bg-danger fs-6 py-2 px-3">
              Out of Stock
            </span>
          )}
        </Link>

        <div className="card-body">
          <h5 className="card-title text-truncate">{name}</h5>
          <p className="card-text text-truncate" style={{ maxHeight: "3em" }}>
            {description}
          </p>

          {/* Show warning if stock is low (but not 0) */}
          {!isOutOfStock && stock !== null && stock < 10 && (
            <small className="text-danger fw-bold d-block mb-1">
              {isMaxReached ? "Max stock reached!" : `Only ${stock} left!`}
            </small>
          )}

          <div className="d-flex justify-content-between align-items-center">
            <span className="h5 mb-0">Rs.{price}</span>
            <div>
              <i className="bi bi-star-fill text-warning"></i>
              <i className="bi bi-star-fill text-warning"></i>
              <i className="bi bi-star-fill text-warning"></i>
              <i className="bi bi-star-fill text-warning"></i>
              <i className="bi bi-star-half text-warning"></i>
              <small className="text-muted">(4.5)</small>
            </div>
          </div>
        </div>

        <div className="card-footer d-flex justify-content-between bg-light">
          <Link className="btn btn-success btn-sm" to={`/food/${id}`}>
            View Food
          </Link>

          {isOutOfStock ? (
            <button className="btn btn-secondary btn-sm" disabled>
              Unavailable
            </button>
          ) : (
            <>
              {qty > 0 ? (
                <div className="d-flex align-items-center gap-2">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => decreaseQty(id)}
                  >
                    <i className="bi bi-dash-circle"></i>
                  </button>

                  <span className="fw-bold">{qty}</span>

                  {/* PLUS BUTTON: Stops when limit reached */}
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => {
                      // Double check before adding
                      if (!isMaxReached) {
                        increaseQty(id);
                      }
                    }}
                    // Bootstrap will visually disable the button
                    disabled={isMaxReached}
                  >
                    <i className="bi bi-plus-circle"></i>
                  </button>
                </div>
              ) : (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => increaseQty(id)}
                >
                  <i className="bi bi-plus-circle"></i> Add
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodItem;
