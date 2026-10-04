import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function MyOrderDetails() {
const { id } = useParams();

const [order, setOrder] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [cancelling, setCancelling] = useState(false);

const getOrder = async () => {
try {
setLoading(true);
setError("");


  const savedUser = localStorage.getItem("user");

  if (!savedUser) {
    setError("Please login first.");
    return;
  }

  const user = JSON.parse(savedUser);

  const response = await fetch(
    `http://localhost:8080/api/orders/${id}`,
    {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load order");
  }

  const data = await response.json();
  setOrder(data);
} catch (error) {
  console.error("Order details error:", error);
  setError("Failed to load order details.");
} finally {
  setLoading(false);
}


};

useEffect(() => {
getOrder();
}, [id]);

const handleCancelOrder = async () => {
const confirmCancel = window.confirm(
"Are you sure you want to cancel this order?"
);


if (!confirmCancel) {
  return;
}

try {
  setCancelling(true);
  setError("");

  const savedUser = localStorage.getItem("user");

  if (!savedUser) {
    setError("Please login first.");
    return;
  }

  const user = JSON.parse(savedUser);

  const response = await fetch(
    `http://localhost:8080/api/orders/${id}/cancel`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to cancel order");
  }

  setOrder(data);
  alert("Order cancelled successfully.");
} catch (error) {
  console.error("Cancel order error:", error);
  setError(error.message || "Failed to cancel order.");
} finally {
  setCancelling(false);
}


};

if (loading) {
return ( <main className="order-details-page"> <div className="order-details-container"> <p className="order-details-message">Loading order...</p> </div> </main>
);
}

if (error && !order) {
return ( <main className="order-details-page"> <div className="order-details-container"> <p className="order-details-error">{error}</p>


      <Link to="/account/orders" className="order-back-button">
        Back to My Orders
      </Link>
    </div>
  </main>
);


}

if (!order) {
return null;
}

return ( <main className="order-details-page"> <div className="order-details-container"> <div className="order-details-header"> <div> <h1>Order #{order.id}</h1>


        <span
          className={`order-status ${order.status
            ?.toLowerCase()
            .replace(/\s+/g, "-")}`}
        >
          {order.status}
        </span>
      </div>
    </div>

    {error && <p className="order-details-error">{error}</p>}

    <section className="order-info-card">
      <h2>Customer Information</h2>

      <div className="order-info-grid">
        <div>
          <span>Name</span>
          <strong>{order.fullName}</strong>
        </div>

        <div>
          <span>Email</span>
          <strong>{order.email}</strong>
        </div>

        <div>
          <span>Phone</span>
          <strong>{order.phone}</strong>
        </div>
      </div>
    </section>

    <section className="order-info-card">
      <h2>Delivery Information</h2>

      <div className="order-info-grid">
        <div>
          <span>Address</span>
          <strong>{order.address}</strong>
        </div>

        <div>
          <span>City</span>
          <strong>{order.city}</strong>
        </div>

        <div>
          <span>Payment</span>
          <strong>{order.paymentMethod}</strong>
        </div>
      </div>
    </section>

    <section className="order-products-card">
      <h2>Products</h2>

      <div className="order-products-list">
        {order.items?.map((item) => (
          <div className="order-product-item" key={item.id}>
            <div>
              <h3>{item.product?.name}</h3>
              <p>Quantity: {item.quantity}</p>
            </div>

            <strong>
              ${(item.price * item.quantity).toFixed(2)}
            </strong>
          </div>
        ))}
      </div>

      <div className="order-total">
        <span>Total</span>
        <strong>${Number(order.totalPrice).toFixed(2)}</strong>
      </div>
    </section>

    <div className="order-bottom-actions">
      <Link to="/account/orders" className="order-back-button">
        Back to My Orders
      </Link>

      {order.status?.toLowerCase() !== "cancelled" && (
        <Link
          to={`/account/orders/${order.id}/tracking`}
          className="order-track-button"
        >
          Track Order
        </Link>
      )}

      {order.status?.toLowerCase() === "pending" && (
        <button
          type="button"
          className="order-cancel-button"
          onClick={handleCancelOrder}
          disabled={cancelling}
        >
          {cancelling ? "Cancelling..." : "Cancel Order"}
        </button>
      )}

      <Link to="/products" className="order-shopping-button">
        Continue Shopping
      </Link>
    </div>
  </div>
</main>


);
}

export default MyOrderDetails;
