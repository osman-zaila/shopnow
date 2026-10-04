import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function OrderTracking() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrder = async () => {
    try {
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
        throw new Error("Failed to fetch order");
      }

      const data = await response.json();

      setOrder(data);
      setError("");
    } catch (error) {
      console.error("Order tracking error:", error);
      setError("Failed to load order.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();

    const interval = setInterval(() => {
      fetchOrder();
    }, 3000);

    return () => clearInterval(interval);
  }, [id]);

  const steps = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
  ];

  const currentStep = order
    ? steps.indexOf(order.status)
    : 0;

  if (loading) {
    return (
      <main className="order-tracking-page">
        <div className="orders-loading">
          <h2>Loading order...</h2>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="order-tracking-page">
        <div className="orders-empty">
          <h2>{error || "Order not found"}</h2>

          <Link
            to="/account/orders"
            className="continue-shopping"
          >
            Back to My Orders
          </Link>
        </div>
      </main>
    );
  }

  if (order.status?.toLowerCase() === "cancelled") {
    return (
      <main className="order-tracking-page">
        <div className="order-tracking-header">
          <h1>Track Your Order</h1>
          <p>Order #{order.id}</p>
        </div>

        <div className="order-cancelled-card">
          <div className="cancelled-icon">×</div>

          <h2>Order Cancelled</h2>

          <p>
            This order has been cancelled and will not be delivered.
          </p>

          <strong>
            Order #{order.id}
          </strong>
        </div>

        <div className="delivery-code-card">
          <div className="delivery-code-content">
            <p>Order Total</p>

            <h2>
              ${Number(order.totalPrice).toFixed(2)}
            </h2>
          </div>
        </div>

        <div className="order-customer-card">
          <h2>Delivery Information</h2>

          <div className="customer-info-grid">
            <div>
              <span>Name</span>
              <strong>{order.fullName}</strong>
            </div>

            <div>
              <span>Phone</span>
              <strong>{order.phone}</strong>
            </div>

            <div>
              <span>City</span>
              <strong>{order.city}</strong>
            </div>

            <div>
              <span>Address</span>
              <strong>{order.address}</strong>
            </div>
          </div>
        </div>

        <div className="my-order-actions">
          <Link
            to={`/account/orders/${order.id}`}
            className="view-order-button"
          >
            View Order Details
          </Link>

          <Link
            to="/account/orders"
            className="continue-shopping"
          >
            My Orders
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="order-tracking-page">

      <div className="order-tracking-header">
        <h1>Track Your Order</h1>
        <p>Order #{order.id}</p>
      </div>

      <div className="order-progress-card">

        <div className="order-progress-header">
          <div>
            <h2>Order Status</h2>

            <p>
              Your order is currently{" "}
              <strong>{order.status}</strong>
            </p>
          </div>

          <div className="my-order-total">
            ${Number(order.totalPrice).toFixed(2)}
          </div>
        </div>

        <div className="order-progress">

          {steps.map((step, index) => (
            <div
              className={`progress-step ${
                index <= currentStep ? "active" : ""
              }`}
              key={step}
            >
              <div className="progress-circle">
                {index < currentStep
                  ? "✓"
                  : index + 1}
              </div>

              <span>{step}</span>
            </div>
          ))}

        </div>
      </div>

      <div className="delivery-code-card">
        <div className="delivery-code-content">
          <p>Delivery Code</p>

          <h2>
            {order.deliveryCode || "------"}
          </h2>
        </div>
      </div>

      <div className="order-customer-card">
        <h2>Delivery Information</h2>

        <div className="customer-info-grid">

          <div>
            <span>Name</span>
            <strong>{order.fullName}</strong>
          </div>

          <div>
            <span>Phone</span>
            <strong>{order.phone}</strong>
          </div>

          <div>
            <span>City</span>
            <strong>{order.city}</strong>
          </div>

          <div>
            <span>Address</span>
            <strong>{order.address}</strong>
          </div>

        </div>
      </div>

      <div className="my-order-actions">

        <Link
          to={`/account/orders/${order.id}`}
          className="view-order-button"
        >
          View Order Details
        </Link>

        <Link
          to="/account/orders"
          className="continue-shopping"
        >
          My Orders
        </Link>

      </div>

    </main>
  );
}

export default OrderTracking;