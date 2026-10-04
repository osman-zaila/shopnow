import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function AdminOrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8080/api/orders/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Order not found");
        }

        return response.json();
      })
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching order:", error);
        setLoading(false);
      });
  }, [id]);

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;

    setUpdating(true);

    try {
      const response = await fetch(
        `http://localhost:8080/api/orders/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const updatedOrder = await response.json();

      setOrder(updatedOrder);
    } catch (error) {
      console.error("Status update error:", error);
      alert("Failed to update order status.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <main className="admin-order-details-page">
        <div className="admin-order-loading">
          <div className="admin-orders-spinner"></div>
          <h2>Loading order...</h2>
          <p>Please wait while order details are loading.</p>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="admin-order-details-page">
        <div className="order-not-found">
          <div className="no-orders-icon">📦</div>
          <h2>Order Not Found</h2>
          <p>The order you are looking for does not exist.</p>

          <Link
            to="/admin/orders"
            className="back-button"
          >
            Back to Orders
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-order-details-page">
      <div className="admin-order-details-container">
        <div className="admin-order-details-header">
          <div>
            <span className="admin-orders-label">
              SHOPNOW ADMIN
            </span>

            <h1>Order #{order.id}</h1>

            <p>View complete order information.</p>
          </div>

          <Link
            to="/admin/orders"
            className="back-button"
          >
            ← Back to Orders
          </Link>
        </div>

        <div className="admin-status-card">
          <div>
            <h2>Order Status</h2>

            <p>
              Update the current status of this order.
            </p>
          </div>

          <select
            value={order.status || "Pending"}
            onChange={handleStatusChange}
            disabled={updating}
            className={`order-status-select status-${(
              order.status || "Pending"
            )
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
          >
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="admin-customer-card">
          <div className="admin-card-title">
            <h2>Customer Information</h2>
            <span>Order #{order.id}</span>
          </div>

          <div className="admin-customer-grid">
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

            <div>
              <span>City</span>
              <strong>{order.city}</strong>
            </div>

            <div className="admin-address">
              <span>Address</span>
              <strong>{order.address}</strong>
            </div>

            <div>
              <span>Payment Method</span>
              <strong>{order.paymentMethod}</strong>
            </div>
          </div>
        </div>

        <div className="admin-order-products-card">
          <div className="admin-products-header">
            <div>
              <h2>Order Products</h2>
              <p>Products included in this order.</p>
            </div>

            <span>
              {order.items ? order.items.length : 0} Items
            </span>
          </div>

          <div className="admin-order-products-list">
            {order.items && order.items.length > 0 ? (
              order.items.map((item) => (
                <div
                  className="admin-order-product"
                  key={item.id}
                >
                  <div className="admin-product-info">
                    <div className="admin-product-image">
                      {item.product?.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                        />
                      ) : (
                        <div className="admin-no-image">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="admin-product-details">
                      <h3>{item.product?.name}</h3>

                      <p>
                        Category: {item.product?.category}
                      </p>

                      <p>
                        Quantity: {item.quantity}
                      </p>

                      <p>
                        Unit Price: $
                        {Number(item.price || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="admin-product-price">
                    <span>Subtotal</span>

                    <strong>
                      $
                      {(
                        Number(item.price || 0) *
                        Number(item.quantity || 0)
                      ).toFixed(2)}
                    </strong>
                  </div>
                </div>
              ))
            ) : (
              <div className="admin-no-products">
                <p>No products found for this order.</p>
              </div>
            )}
          </div>

          <div className="admin-order-total">
            <span>Total</span>

            <strong>
              ${Number(order.totalPrice || 0).toFixed(2)}
            </strong>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AdminOrderDetails;
