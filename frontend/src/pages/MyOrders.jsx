import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

function MyOrders() {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      setLoading(false);
      return;
    }

    const user = JSON.parse(savedUser);

    if (!user.email) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/orders/email/${encodeURIComponent(
          user.email
        )}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();

      setOrders(data);
    } catch (error) {
      console.error("Orders error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    const interval = setInterval(() => {
      fetchOrders();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const savedUser = localStorage.getItem("user");

  const user = savedUser ? JSON.parse(savedUser) : null;

  if (!user) {
    return (
      <main className="my-orders-page">
        <div className="orders-empty">
          <h2>Please login first</h2>

          <Link
            to="/login"
            className="continue-shopping"
          >
            Login
          </Link>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="my-orders-page">
        <div className="orders-loading">
          <h2>Loading your orders...</h2>
        </div>
      </main>
    );
  }

  return (
    <main className="my-orders-page">
      <div className="my-orders-header">
        <h1>My Orders</h1>

        <p>
          View your previous orders and order details.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="orders-empty">
          <h2>No orders yet</h2>

          <p>
            You have not placed any orders yet.
          </p>

          <Link
            to="/products"
            className="continue-shopping"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="my-orders-list">
          {orders.map((order) => (
            <div
              className="my-order-card"
              key={order.id}
            >
              <div className="my-order-header">
                <div>
                  <h2>
                    Order #{order.id}
                  </h2>

                  <p>
                    {order.fullName}
                  </p>
                </div>

                <div className="my-order-total">
                  $
                  {Number(order.totalPrice).toFixed(2)}
                </div>
              </div>

              <div className="my-order-info">
                <div>
                  <span>Payment</span>

                  <strong>
                    {order.paymentMethod}
                  </strong>
                </div>

                <div>
                  <span>City</span>

                  <strong>
                    {order.city}
                  </strong>
                </div>

                <div>
                  <span>Items</span>

                  <strong>
                    {order.items
                      ? order.items.length
                      : 0}
                  </strong>
                </div>

                <div>
                  <span>Status</span>

                  <strong>
                    {order.status}
                  </strong>
                </div>
              </div>

              <div className="my-order-products">
                {order.items &&
                  order.items.map((item) => (
                    <div
                      className="my-order-product"
                      key={item.id}
                    >
                      <div>
                        <h3>
                          {item.product?.name}
                        </h3>

                        <p>
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <strong>
                        $
                        {(
                          Number(item.price) *
                          item.quantity
                        ).toFixed(2)}
                      </strong>
                    </div>
                  ))}
              </div>

              <div className="my-order-actions">
                <Link
                  to={`/account/orders/${order.id}/tracking`}
                  className="view-order-button"
                >
                  Track Order
                </Link>

                <Link
                  to={`/account/orders/${order.id}`}
                  className="view-order-button"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default MyOrders;