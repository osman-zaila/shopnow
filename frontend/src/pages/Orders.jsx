import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        setError("Please login first.");
        setLoading(false);
        return;
      }

      const user = JSON.parse(storedUser);

      if (!user.email) {
        setError("User email was not found.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `http://localhost:8080/api/orders/email/${encodeURIComponent(
          user.email
        )}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const text = await response.text();

      if (!response.ok) {
        throw new Error(
          text || `Failed to load orders. Status: ${response.status}`
        );
      }

      const data = text ? JSON.parse(text) : [];

      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Orders error:", error);
      setError(error.message || "Failed to load orders.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <div className="orders-page">
      <div className="orders-container">

        <div className="orders-header">
          <div>
            <h1>My Orders</h1>
            <p>View your previous orders and check their status.</p>
          </div>

          <button
            className="orders-refresh-button"
            onClick={getOrders}
          >
            ↻ Refresh
          </button>
        </div>

        {loading && (
          <div className="orders-message">
            Loading your orders...
          </div>
        )}

        {error && !loading && (
          <div className="orders-error">
            {error}
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="orders-empty">
            <div className="orders-empty-icon">📦</div>

            <h2>No orders yet</h2>

            <p>
              You have not placed any orders yet.
            </p>

            <Link to="/products" className="orders-shop-button">
              Start Shopping
            </Link>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="customer-orders-list">
            {orders.map((order) => (
              <div className="customer-order-card" key={order.id}>

                <div className="customer-order-top">
                  <div>
                    <span className="customer-order-label">
                      Order
                    </span>

                    <h2>#{order.id}</h2>
                  </div>

                  <span
                    className={`order-status ${
                      String(order.status || "Pending")
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                    }`}
                  >
                    {order.status || "Pending"}
                  </span>
                </div>

                <div className="customer-order-info">

                  <div>
                    <span>Payment</span>
                    <strong>
                      {order.paymentMethod || "-"}
                    </strong>
                  </div>

                  <div>
                    <span>City</span>
                    <strong>
                      {order.city || "-"}
                    </strong>
                  </div>

                  <div>
                    <span>Total</span>
                    <strong>
                      $
                      {Number(
                        order.totalPrice ||
                        order.total ||
                        order.totalAmount ||
                        order.amount ||
                        0
                      ).toFixed(2)}
                    </strong>
                  </div>

                  <div>
                    <span>Address</span>
                    <strong>
                      {order.address ||
                        order.deliveryAddress ||
                        "-"}
                    </strong>
                  </div>

                </div>

                <div className="customer-order-bottom">

                  <span>
                    {order.items?.length || 0} product
                    {order.items?.length === 1 ? "" : "s"}
                  </span>

                  <Link
                    to={`/account/orders/${order.id}`}
                    className="orders-view-button"
                  >
                    View Order
                  </Link>

                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Orders;