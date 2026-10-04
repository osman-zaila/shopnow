import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function OrderManagement() {
const [orders, setOrders] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [updatingId, setUpdatingId] = useState(null);

const getOrders = async () => {
setLoading(true);
setError("");


try {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (!storedUser?.token) {
    throw new Error("Please login first.");
  }

  const response = await fetch(
    "http://localhost:8080/api/orders",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storedUser.token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to load orders."
    );
  }

  setOrders(Array.isArray(data) ? data : []);
} catch (err) {
  setError(
    err.message || "Something went wrong while loading orders."
  );
} finally {
  setLoading(false);
}


};

useEffect(() => {
getOrders();
}, []);

const updateStatus = async (orderId, status) => {
try {
setUpdatingId(orderId);
setError("");


  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (!storedUser?.token) {
    throw new Error("Please login first.");
  }

  const response = await fetch(
    `http://localhost:8080/api/orders/${orderId}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storedUser.token}`,
      },
      body: JSON.stringify({
        status,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update order status."
    );
  }

  setOrders((currentOrders) =>
    currentOrders.map((order) =>
      order.id === orderId
        ? { ...order, status: data.status }
        : order
    )
  );
} catch (err) {
  setError(
    err.message || "Failed to update order status."
  );
} finally {
  setUpdatingId(null);
}


};

const formatPrice = (price) => {
return `$${Number(price || 0).toFixed(2)}`;
};

if (loading) {
return ( <main className="orders-page"> <div className="orders-container"> <div className="orders-header"> <div> <h1>Orders</h1> <p>Manage customer orders from your store.</p> </div> </div>


      <div className="orders-loading">
        Loading orders...
      </div>
    </div>
  </main>
);


}

return ( <main className="orders-page"> <div className="orders-container">

    <div className="orders-header">
      <div>
        <h1>Orders</h1>
        <p>Manage customer orders from your store.</p>
      </div>

      <button
        type="button"
        className="orders-refresh-button"
        onClick={getOrders}
      >
        ↻ Refresh
      </button>
    </div>

    {error && (
      <div className="orders-error">
        {error}
      </div>
    )}

    {!error && orders.length === 0 && (
      <div className="orders-empty">
        No orders found.
      </div>
    )}

    {orders.length > 0 && (
      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Phone</th>
              <th>City</th>
              <th>Payment</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>

                <td>
                  <strong>#{order.id}</strong>
                </td>

                <td>
                  {order.customerName ||
                    order.fullName ||
                    order.name ||
                    "-"}
                </td>

                <td>
                  {order.customerEmail ||
                    order.email ||
                    "-"}
                </td>

                <td>
                  {order.customerPhone ||
                    order.phone ||
                    "-"}
                </td>

                <td>
                  {order.city || "-"}
                </td>

                <td>
                  {order.paymentMethod || "-"}
                </td>

                <td>
                  <strong>
                    {formatPrice(
                      order.total ||
                        order.totalAmount ||
                        order.amount ||
                        order.totalPrice
                    )}
                  </strong>
                </td>

                <td>
                  <select
                    className={`order-status-select ${String(
                      order.status || "Pending"
                    )
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                    value={order.status || "Pending"}
                    disabled={updatingId === order.id}
                    onChange={(event) =>
                      updateStatus(
                        order.id,
                        event.target.value
                      )
                    }
                  >
                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Processing">
                      Processing
                    </option>

                    <option value="Shipped">
                      Shipped
                    </option>

                    <option value="Delivered">
                      Delivered
                    </option>

                    <option value="Cancelled">
                      Cancelled
                    </option>
                  </select>
                </td>

                <td>
                  <Link
                    to={`/admin/orders/${order.id}`}
                    className="orders-view-button"
                  >
                    View Details
                  </Link>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

  </div>
</main>


);
}

export default OrderManagement;
